import { ButtonRadialGradient, CircleRadialGradient } from "@/components/radial-gradient";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { themeColors, useTheme } from "@/utils/theme-provider";
import { PlusIcon, PencilIcon } from "lucide-react-native";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { useCallback, useMemo } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";


const Star = ({ style }: { style: any }) => (
	<View
		style={[{
			width: 3,
			height: 3,
			backgroundColor: 'white',
			borderRadius: 2,
			position: 'absolute',
			opacity: 0.4,
		}, style]}
	/>
);


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
			<View style={stylesLayout.container}>
				<Animated.View
					style={stylesLayout.centerContent}
					entering={FadeInDown.duration(800).delay(200).springify()}
				>
					<View style={stylesLayout.shadowImage}>
						<Image style={stylesLayout.image} source="https://picsum.photos/seed/696/3000/2000" />
					</View>
					<CircleRadialGradient
						offset="80%"
						icon={null}
						color={themeColors[theme.color].primary}
						style={StyleSheet.flatten([
							stylesLayout.gradientHalo,
							{ width: 350, zIndex: -10, opacity: 0.1 },
						])}
					/>

					<CircleRadialGradient
						offset="80%"
						icon={null}
						color={themeColors[theme.color].primary}
						style={StyleSheet.flatten([stylesLayout.gradientHalo, { width: 240, zIndex: -9, opacity: 0.2 }])}
					/>
				</Animated.View>
				<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
					<TextGradient color={theme.color} text={"Coufefcou"} style={{ fontSize: 58 }} />
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
