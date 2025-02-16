import { getStorageColor, getStorageImageUri, getStorageName, themeColors } from "@/utils/theme-storage";
import Animated, { Easing, FadeInDown, FadeInLeft, FadeInRight } from "react-native-reanimated";
import { ButtonRadialGradient, CircleRadialGradient } from "@/components/radial-gradient";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { PencilIcon, UserRoundPenIcon } from "lucide-react-native";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { useCallback, useState } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";


export default function Page() {
	const themeColor = getStorageColor();
	const [canSearch, setCanSearch] = useState(false);
	const [showIngredients, setShowIngredients] = useState(false);

	const enteringAnimation = useCallback(
		() =>
			FadeInDown.duration(600)
				.delay(300)
				.easing(Easing.inOut(Easing.ease))
				.springify()
				.damping(16)
				.withInitialValues({
					opacity: 0,
					transform: [{ translateY: 100 }],
				}),
		[]
	);
	const enteringAnimationLeft = useCallback(
		() =>
			FadeInLeft.delay(150)
				.easing(Easing.in(Easing.ease))
				.springify()
				.damping(17)
				.stiffness(160)
				.withInitialValues({
					opacity: 0,
					transform: [{ translateX: -100 }],
				}),
		[]
	);

	const enteringAnimationRight = useCallback(
		() =>
			FadeInRight.delay(150)
				.easing(Easing.in(Easing.ease))
				.springify()
				.damping(17)
				.stiffness(160)
				.withInitialValues({
					opacity: 0,
					transform: [{ translateX: 100 }],
				}),
		[]
	);

	return (
		<LayoutBackground color={themeColor} centeredContent={false}>
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
				<Pressable style={stylesLayout.paddingTopButtons} onPress={() => router.push("/profile")}>
					<UserRoundPenIcon size={24} color="#fff" />
				</Pressable>
			</Animated.View>

			<View style={{ paddingTop: 85 }}>
				<Animated.View entering={enteringAnimationLeft()}>
					<TextGradient color={themeColor} text={"FRIGO"} home style={{ fontSize: 75 }} />
				</Animated.View>
				<Animated.View entering={enteringAnimationRight()}>
					<TextGradient color={themeColor} text={"CHEF !"} home style={{ fontSize: 75, marginTop: -15 }} />
				</Animated.View>

				<Animated.View
					style={stylesLayout.centerContent}
					entering={FadeInDown.duration(800).delay(400).springify()}
				>
					<View style={stylesLayout.shadowImage}>
						<Image style={stylesLayout.image} source={getStorageImageUri()} />
					</View>
				</Animated.View>
			</View>

			{!showIngredients ? (
				<Animated.View entering={enteringAnimationLeft()} style={styles.highPaddingTop}>
					<TextGradient
						lowShadow
						color={themeColor}
						text={"Vos ingrédients :"}
						style={styles.ingredientsText}
					/>
				</Animated.View>
			) : null}

			{canSearch && (
				<Animated.View
					style={StyleSheet.flatten([stylesLayout.bottomButton, { alignSelf: "center" }])}
					entering={enteringAnimation()}
				>
					<ButtonRadialGradient
						onPress={() => router.push("/recipe")}
						text="Continuer"
						color={themeColors[themeColor].primaryLight}
					/>
				</Animated.View>
			)}
		</LayoutBackground>
	);
}

const styles = StyleSheet.create({
	ingredientsText: {
		fontSize: 32,
		alignSelf: "flex-start",
		paddingLeft: 20,
	},
	highPaddingTop: {
		paddingTop: 40,
	},
});
