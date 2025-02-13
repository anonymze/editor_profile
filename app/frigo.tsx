import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { ButtonRadialGradient } from "@/components/radial-gradient";
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
	return (
		<LayoutBackground centeredContent color={theme.color}>
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
		</LayoutBackground>
	);
}
