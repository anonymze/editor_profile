import { StyleProp, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";


const DEFAULT_FONT_SIZE = 30;
const getHeight = (fontSize: number) => Math.floor(fontSize * 1.3);

export function TextGradient({ text, style }: { text: string; style?: StyleProp<TextStyle> }) {
	const fontSize = StyleSheet.flatten(style).fontSize ?? DEFAULT_FONT_SIZE;
	const height = getHeight(fontSize);

	return (
		<MaskedView
			style={[styles.flexDirection, { height }]}
			maskElement={<Text style={[styles.text, style]}>{text}</Text>}
		>
			<LinearGradient
				colors={["#fff", "#79baff"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={styles.flex}
			/>
		</MaskedView>
	);
}

export function InputTextGradient({ text, style }: { text: string; style?: StyleProp<TextStyle> }) {
	const [inputText, setInputText] = useState(text);
	const fontSize = StyleSheet.flatten(style).fontSize ?? DEFAULT_FONT_SIZE;
	const height = getHeight(fontSize);

	return (
		<View style={[styles.view, { height }]}>
			<TextGradient text={inputText} style={{ fontSize }} />
			<TextInput style={[styles.input, style]} onChangeText={setInputText} value={inputText} />
		</View>
	);
}

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
		shadowOpacity: 0.2,
		shadowRadius: 0.5,
	},
	flex: {
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
