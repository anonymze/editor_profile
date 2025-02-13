import Animated, { FadeIn, FadeInDown, runOnJS, FadeOut, Easing } from "react-native-reanimated";
import LayoutBackground, { stylesLayoutDynamic } from "@/layout/background";
import { useTheme, themeColors } from "@/utils/theme-provider";
import { InputTextGradient } from "@/components/text-gradient";
import { StyleSheet, TextInput, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { XIcon, CheckIcon } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { getKeysTypedObject } from "@/utils/helper";
import { router } from "expo-router";
import { Image } from "expo-image";


export default function Index() {
	const inputRef = useRef<TextInput>(null);
	const [animating, setAnimating] = useState(true);
	const theme = useTheme();
	const stylesLayout = stylesLayoutDynamic(themeColors[theme.color].secondary);
	const bottomButtonRef = useRef<Animated.View>(null);

	const enteringAnimation = useCallback(
		() =>
			FadeInDown
				.duration(600)
				.delay(300)
				.easing(Easing.inOut(Easing.ease))  // Smooth ease-out animation
				.springify()
				.stiffness(100)
				.damping(16)
				.withInitialValues({
					opacity: 0,
					transform: [{ translateY: 100 }]  // Start from 100 units below
				})
				.withCallback((finished: boolean) => {
					'worklet';
					runOnJS(setAnimating)(false);
				}),
		[]
	);

	return (
		<LayoutBackground
			color={theme.color}
			centeredContent
			onLayout={() => {
				// TODO: Remove this
				// inputRef.current?.focus();
			}}
		>
			<View style={stylesLayout.container}>
				<Animated.View style={styles.shadowImage} entering={FadeInDown.duration(800).delay(200).springify()}>
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
				ref={bottomButtonRef}
				style={StyleSheet.flatten([stylesLayout.bottomButton, styles.buttons])}
				entering={enteringAnimation()}
				exiting={FadeOut.duration(600)}
			>
				{getKeysTypedObject(themeColors).map((color) => (
					<Pressable
						style={[styles.buttonColor, { backgroundColor: themeColors[color].primary }]}
						key={color}
						onPress={() => {
							console.log('hihi')
							if (animating) return;
							theme.setTheme(color);
						}}
					>
						{theme.color === color && (
							<Animated.View entering={FadeIn.duration(600)}>
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
