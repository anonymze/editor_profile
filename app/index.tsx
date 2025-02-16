import { getStorageColor, getStorageImageUri, getStorageName, themeColors } from "@/utils/theme-storage";
import { ButtonRadialGradient, CircleRadialGradient } from "@/components/radial-gradient";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { PencilIcon } from "lucide-react-native";
import { useCallback, useState } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";


export default function Page() {
	const themeColor = getStorageColor();
	const [canSearch, setCanSearch] = useState(false);

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
		<LayoutBackground color={themeColor} centeredContent>
			<Animated.View
				style={StyleSheet.flatten([
					stylesLayout.topButtons,
					stylesLayout.topRightButton,
					{
						backgroundColor: themeColors[themeColor].secondary,
					},
				])}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable style={stylesLayout.paddingTopButtons} onPress={() => router.push("/profile-edit")}>
					<PencilIcon size={22} color="#fff" />
				</Pressable>
			</Animated.View>

			<View style={StyleSheet.flatten([stylesLayout.container])}>
				<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
					<TextGradient color={themeColor} text={"FRIGO "} style={{ fontSize: 75 }} />
					<TextGradient color={themeColor} text={"CHEF"} style={{ fontSize: 75, marginTop: -15 }} />
				</Animated.View>
				<Animated.View      
					style={stylesLayout.centerContent}
					entering={FadeInDown.duration(800).delay(400).springify()}
				>
					<View style={stylesLayout.shadowImage}>
						<Image style={stylesLayout.image} source={getStorageImageUri()} />
					</View>
					<CircleRadialGradient
						offset="80%"
						icon={null}
						color={themeColors[themeColor].primary}
						style={StyleSheet.flatten([stylesLayout.gradientHalo, stylesLayout.bigHalo])}
					/>

					<CircleRadialGradient
						offset="80%"
						icon={null}
						color={themeColors[themeColor].primary}
						style={StyleSheet.flatten([stylesLayout.gradientHalo, stylesLayout.smallHalo])}
					/>
				</Animated.View>
			</View>

			{canSearch && (
				<Animated.View style={stylesLayout.bottomButton} entering={enteringAnimation()}>
					<ButtonRadialGradient
						onPress={() => router.push("/frigo")}
						text="Continuer"
						color={themeColors[themeColor].primaryLight}
					/>
				</Animated.View>
			)}
		</LayoutBackground>
	);
}
