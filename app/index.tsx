import { ButtonRadialGradient, CircleRadialGradient } from "@/components/radial-gradient";
import { getStorageImageUri, getStorageName, storage } from "@/utils/theme-storage";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { themeColors, useTheme } from "@/utils/theme-provider";
import { PlusIcon, PencilIcon } from "lucide-react-native";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Image } from "expo-image";


export default function Page() {
	const theme = useTheme();
	const [name, setName] = useState(storage.getString("name") ?? "Default");

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
			<View style={stylesLayout.container}>
				<Animated.View
					style={stylesLayout.centerContent}
					entering={FadeInDown.duration(800).delay(200).springify()}
				>
					<View style={stylesLayout.shadowImage}>
						<Image style={stylesLayout.image} source={getStorageImageUri()} />
					</View>
					<CircleRadialGradient
						offset="80%"
						icon={null}
						color={themeColors[theme.color].primary}
						style={StyleSheet.flatten([
							stylesLayout.gradientHalo,
							stylesLayout.bigHalo,
						])}
					/>

					<CircleRadialGradient
						offset="80%"
						icon={null}
						color={themeColors[theme.color].primary}
						style={StyleSheet.flatten([stylesLayout.gradientHalo, stylesLayout.smallHalo])}
					/>
				</Animated.View>
				<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
					<TextGradient color={theme.color} text={getStorageName()} style={{ fontSize: 55 }} />
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
				<Pressable style={stylesLayout.paddingTopButtons} onPress={() => router.push("/profile-edit")}>
					<PencilIcon size={22} color="#fff" />
				</Pressable>
			</Animated.View>

			<Animated.View style={stylesLayout.bottomButton} entering={enteringAnimation()}>
				<ButtonRadialGradient
					onPress={() => router.push("/frigo")}
					text="Continuer"
					color={themeColors[theme.color].primaryLight}
				/>
			</Animated.View>
		</LayoutBackground>
	);
}
