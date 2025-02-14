import Animated, { FadeIn, FadeInDown, runOnJS, FadeOut, Easing } from "react-native-reanimated";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from "react-native";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { CircleRadialGradient } from "@/components/radial-gradient";
import { XIcon, CheckIcon, CameraIcon } from "lucide-react-native";
import { useTheme, themeColors } from "@/utils/theme-provider";
import { InputTextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
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
						style={stylesLayout.centerContent}
						entering={FadeInDown.duration(800).delay(200).springify()}
					>
						<View style={[stylesLayout.shadowImage, { justifyContent: "center", alignItems: "center" }]}>
							<Image style={stylesLayout.image} source="https://picsum.photos/seed/696/3000/2000" />
							<Pressable
								onPress={() => {
									console.log("pressed");
								}}
								style={{
									borderWidth: 1,
									borderColor: "#fff",
									width: 40,
									aspectRatio: 1,
									position: "absolute",
									right: 2,
									top: 2,
									borderRadius: 99,
									backgroundColor: "rgba(255, 255, 255, 0.4)",
									boxShadow: "inset 0 0 9px 0 #fff",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<CameraIcon fill={themeColors[theme.color].primary} color="#fff" size={26} />
							</Pressable>
						</View>

						<CircleRadialGradient
							offset="80%"
							icon={null}
							color={themeColors[theme.color].primary}
							style={{
								position: "absolute",
								justifyContent: "center",
								alignItems: "center",
								width: 350,
								aspectRatio: 1,
								zIndex: -100,
								opacity: 0.2,
								borderWidth: 0,
								borderRadius: 999,
								shadowOpacity: 0,
							}}
						/>

						<CircleRadialGradient
							offset="80%"
							icon={null}
							color={themeColors[theme.color].primary}
							style={{
								position: "absolute",
								justifyContent: "center",
								alignItems: "center",
								width: 240,
								aspectRatio: 1,
								zIndex: -99,
								opacity: 0.1,
								borderWidth: 0,
								borderRadius: 999,
								backgroundColor: "rgba(255, 255, 255, 0.1)",
								shadowOpacity: 0,
							}}
						/>
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
							color={themeColors[color].primary}
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
});
