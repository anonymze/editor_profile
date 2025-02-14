import Animated, { FadeIn, FadeInDown, runOnJS, FadeOut, Easing } from "react-native-reanimated";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from "react-native";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { CircleRadialGradient } from "@/components/radial-gradient";
import { useTheme, themeColors } from "@/utils/theme-provider";
import { InputTextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { XIcon, CheckIcon } from "lucide-react-native";
import { getKeysTypedObject } from "@/utils/helper";
import { router } from "expo-router";
import { Image } from "expo-image";


export default function Page() {
	const inputRef = useRef<TextInput>(null);
	const [animating, setAnimating] = useState(true);
	const theme = useTheme();
	const bottomButtonRef = useRef<Animated.View>(null);

	const enteringAnimation = useMemo(
		() =>
			FadeInDown.duration(600)
				.delay(300)
				.easing(Easing.inOut(Easing.ease))
				.springify()
				.stiffness(100)
				.damping(16)
				.withInitialValues({
					opacity: 0,
					transform: [{ translateY: 100 }],
				})
				.withCallback((_) => {
					"worklet";
					runOnJS(setAnimating)(false);
				}),
		[]
	);

	useEffect(() => {
		// dunno why... if i focus on the main thread it will not work
		const timer = setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}, 1);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	const handleThemeChange = useCallback(
		(color: keyof typeof themeColors) => {
			if (animating) return;
			theme.setTheme(color);
		},
		[animating, theme]
	);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1, backgroundColor: themeColors[theme.color].primaryDark }}
			keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 20}
			enabled
		>
			<LayoutBackground color={theme.color} centeredContent>
				<View style={stylesLayout.container}>
					<Animated.View
						style={styles.shadowImage}
						entering={FadeInDown.duration(800).delay(200).springify()}
					>
						<Image style={stylesLayout.image} source="https://picsum.photos/seed/696/3000/2000" />
					</Animated.View>
					<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
						<InputTextGradient
							color={theme.color}
							text={"Coucou"}
							style={{ fontSize: 60 }}
							ref={inputRef}
							maxLength={8}
						/>
					</Animated.View>
				</View>

				<Animated.View
					style={StyleSheet.flatten([
						stylesLayout.topButtons,
						stylesLayout.topLeftButton,
						{
							backgroundColor: themeColors[theme.color].secondary,
						},
					])}
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
					style={StyleSheet.flatten([
						stylesLayout.topButtons,
						stylesLayout.topRightButton,
						{
							backgroundColor: themeColors[theme.color].secondary,
						},
					])}
					entering={FadeInDown.duration(800).delay(200).springify()}
				>
					<Pressable style={stylesLayout.paddingTopButtons}>
						<CheckIcon size={28} color="#fff" />
					</Pressable>
				</Animated.View>

				<Animated.View
					ref={bottomButtonRef}
					style={StyleSheet.flatten([stylesLayout.bottomButton, styles.buttons])}
					entering={enteringAnimation}
					exiting={FadeOut.duration(600)}
				>
					{getKeysTypedObject(themeColors).map((color) => (
						// <Pressable
						// 	style={[styles.buttonColor, { backgroundColor: themeColors[color].primary }]}
						// 	key={color}
						// 	onPress={() => handleThemeChange(color)}
						// >
						// 	{theme.color === color && (
						// 		<Animated.View entering={FadeIn.duration(600)}>
						// 			<CheckIcon size={28} color="#fff" />
						// 		</Animated.View>
						// 	)}
						// </Pressable>
						<CircleRadialGradient
							onPress={() => handleThemeChange(color)}
							key={color}
							icon={
								theme.color === color ? (
									<Animated.View entering={FadeIn.duration(600)}>
										<CheckIcon size={28} color="#fff" />
									</Animated.View>
								) : null
							}
							color={themeColors[color].primaryLight}
						/>
					))}
				</Animated.View>
			</LayoutBackground>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	buttons: {
		flexDirection: "row",
		gap: 17,
		padding: 8,
		borderWidth: 1,
		borderColor: "#fff",
		maxWidth: "100%",
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
