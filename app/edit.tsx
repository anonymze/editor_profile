import LayoutBackground, { stylesLayoutDynamic } from "@/layout/background";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme, themeColors } from "@/utils/theme-provider";
import { InputTextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { XIcon, CheckIcon } from "lucide-react-native";
import { getKeysTypedObject } from "@/utils/helper";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useRef } from "react";


export default function Index() {
	const inputRef = useRef<TextInput>(null);
	const theme = useTheme();
	const stylesLayout = stylesLayoutDynamic(themeColors[theme.color].secondary);

	return (
		<LayoutBackground
			centeredContent
			onLayout={() => {
				inputRef.current?.focus();
			}}
		>
			<View id="container" style={stylesLayout.container}>
				<Animated.View style={styles.shadowImage} entering={FadeInDown.duration(800).delay(200).springify()}>
					<Image style={stylesLayout.image} source="https://picsum.photos/seed/696/3000/2000" />
				</Animated.View>
				<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
					<InputTextGradient text={"Coucou"} style={{ fontSize: 60 }} ref={inputRef} maxLength={8} />
				</Animated.View>
			</View>
			<Animated.View
				style={StyleSheet.flatten([stylesLayout.topButtons, stylesLayout.topLeftButton])}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable
					style={stylesLayout.paddingTopButtons}
					onPress={() => {
						router.push("/");
					}}
				>
					<XIcon size={28} color="#fff" />
				</Pressable>
			</Animated.View>
			<Animated.View
				style={StyleSheet.flatten([stylesLayout.topButtons, stylesLayout.topRightButton])}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable style={stylesLayout.paddingTopButtons}>
					<CheckIcon size={28} color="#fff" />
				</Pressable>
			</Animated.View>

			<Animated.View
				style={StyleSheet.flatten([stylesLayout.bottomButton, styles.buttons])}
				entering={FadeInDown.duration(500).delay(300)}
			>
				{getKeysTypedObject(themeColors).map((color, idx) => (
					<Pressable
						style={[styles.buttonColor, { backgroundColor: themeColors[color].primary }]}
						key={color}
						onPress={() => {
							theme.setTheme(color);
						}}
					>
						{theme.color === color && (
							<Animated.View entering={FadeIn.duration(500)}>
								<CheckIcon size={28} color="#fff" />
							</Animated.View>
						)}
					</Pressable>
				))}
			</Animated.View>
		</LayoutBackground>
	);
}

const styles = StyleSheet.create({
	buttons: {
		flexDirection: "row",
		gap: 16,
		padding: 8,
		borderWidth: 1,
		borderColor: "#fff",
		maxWidth: "auto",
		width: "auto",
		backgroundColor: "rgba(195, 176, 180, 0.7)",
	},
	buttonColor: {
		justifyContent: "center",
		alignItems: "center",
		width: 45,
		aspectRatio: 1,
		borderWidth: 1,
		borderColor: "#fff",
		borderRadius: 99,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowRadius: 3,
	},
	shadowImage: {
		shadowColor: "#000",
		shadowOffset: { width: -1, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
});
