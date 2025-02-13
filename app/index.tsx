import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { themeColors, useTheme } from "@/utils/theme-provider";
import { PlusIcon, PencilIcon } from "lucide-react-native";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useCallback } from "react";
import { Image } from "expo-image";


export default function Page() {
	const theme = useTheme();

	const enteringAnimation = useCallback(
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
				}),
		[]
	);

	return (
		<LayoutBackground centeredContent color={theme.color}>
			<View id="container" style={stylesLayout.container}>
				<Animated.View entering={FadeInDown.duration(800).delay(200).springify()}>
					<Image style={stylesLayout.image} source="https://picsum.photos/seed/696/3000/2000" />
				</Animated.View>
				<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
					<TextGradient color={theme.color} text={"Coufefcou"} style={{ fontSize: 60 }} />
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
				<Pressable style={stylesLayout.paddingTopButtons}>
					<PlusIcon size={28} color="#fff" />
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
				<Pressable style={stylesLayout.paddingTopButtons} onPress={() => router.push("/edit")}>
					<PencilIcon size={22} color="#fff" />
				</Pressable>
			</Animated.View>

			<Animated.View style={StyleSheet.flatten([stylesLayout.bottomButton, {
				backgroundColor: themeColors[theme.color].secondary,
			}])} entering={enteringAnimation()}>
				<Pressable onPress={() => router.push("/frigo")}>
					<Text>Continuer</Text>
				</Pressable>
			</Animated.View>
		</LayoutBackground>
	);
}
