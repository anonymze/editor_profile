import { Dimensions, StyleProp, StyleSheet, Text, TextInput, TextStyle, View } from "react-native";
import { DEFAULT_KEY_NAME, DEFAULT_NAME, themeColors } from "@/utils/theme-storage";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "react-native-linear-gradient";
import { useMMKVString } from "react-native-mmkv";
import { forwardRef } from "react";


const width = Dimensions.get("window").width;

const DEFAULT_FONT_SIZE = 60;
const getHeight = (fontSize: number) => Math.floor(fontSize * 1.3);
const getMaxLength = () => {
	if (width > 400) return 11;
	if (width > 360) return 10;
	if (width > 320) return 9;
	return 8;
};

interface InputTextGradientProps {
	color: keyof typeof themeColors;
	home?: boolean;
	text?: string;
	style?: StyleProp<TextStyle>;
}

export function TextGradient({ text, style, color, home }: InputTextGradientProps) {
	const fontSize = StyleSheet.flatten(style)?.fontSize ?? DEFAULT_FONT_SIZE;
	const height = getHeight(fontSize);

	return (
		<View style={[styles.view]}>
			<MaskedView
				style={[styles.flexDirection, { height: home ? 85 : height }]}
				maskElement={<Text style={StyleSheet.flatten([styles.text, { fontSize }, style])}>{text}</Text>}
			>
				<LinearGradient
					colors={["#fff", themeColors[color].primary]}
					start={{ x: 0, y: home ? 0.9 : 0.4 }}
					end={{ x: 0, y: 1 }}
					style={styles.full}
				/>
			</MaskedView>
		</View>
	);
}

export const InputTextGradient = forwardRef<TextInput, InputTextGradientProps & { maxLength?: number }>(
	({ style, maxLength, color }, ref) => {
		const [nameStore, setNameStore] = useMMKVString(DEFAULT_KEY_NAME);
		const fontSize = StyleSheet.flatten(style)?.fontSize ?? DEFAULT_FONT_SIZE;
		const height = getHeight(fontSize);
		const name = nameStore ?? DEFAULT_NAME;

		return (
			<View style={[styles.view, { height }]}>
				<TextGradient text={name} style={{ fontSize }} color={color} />
				<TextInput
					style={[styles.input, style]}
					onChangeText={(text) => {
						setNameStore(text);
					}}
					defaultValue={name}
					ref={ref}
					maxLength={maxLength ?? getMaxLength()}
					editable={true}
					cursorColor={"#fff"}
					selectionColor={"#fff"}
					returnKeyType="done"
				/>
			</View>
		);
	}
);

const styles = StyleSheet.create({
	input: {
		flex: 1,
		position: "absolute",
		fontWeight: "900",
		color: "transparent",
	},
	text: {
		fontWeight: "900",
		alignSelf: "center",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.4,
		shadowRadius: 0,
	},
	full: {
		flex: 1,
	},
	flexDirection: {
		flexDirection: "row",
	},
	view: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
});
