import { DEFAULT_IMAGE_URI, getStorageColor, getStorageImageUri, getStorageName, themeColors, } from "@/theme/theme-storage";
import { ButtonRadialGradient, CircleRadialGradient } from "@/components/radial-gradient";
import { useEnteringBottomAnimation, useEnteringTopAnimation } from "@/hooks/animations";
import { Gesture, GestureDetector, Pressable } from "react-native-gesture-handler";
import Animated, { FadeInDown, runOnJS } from "react-native-reanimated";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { TextGradient } from "@/components/text-gradient";
import { UserRoundPenIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useMemo } from "react";


export default function Page() {
	const themeColor = getStorageColor();
	const enteringBottomAnimation = useEnteringBottomAnimation();
	const enteringTopAnimation = useEnteringTopAnimation();

	const panGesture = useMemo(
		() =>
			Gesture.Pan()
				.activeOffsetX([-20, 20])
				.onEnd((event) => {
					// swipe left only
					if (event.translationX > 50) {
						runOnJS(router.replace)("/");
					}
				}),
		[]
	);

	return (
		<GestureDetector gesture={panGesture}>
			<LayoutBackground centeredContent color={themeColor}>
				<View style={stylesLayout.containerWithGap}>
					<Animated.View
						style={stylesLayout.centerContent}
						entering={enteringTopAnimation()}
					>
						<View style={stylesLayout.shadowImage}>
							<Image
								style={stylesLayout.image}
								source={getStorageImageUri()}
								contentFit="cover"
								contentPosition="center"
								placeholder={{ uri: DEFAULT_IMAGE_URI }}
								placeholderContentFit="cover"
							/>
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
					<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
						<TextGradient color={themeColor} text={getStorageName()} style={{ fontSize: 55 }} />
					</Animated.View>
				</View>

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
						<UserRoundPenIcon size={24} color="#fff" />
					</Pressable>
				</Animated.View>

				<Animated.View style={stylesLayout.bottomButton} entering={enteringBottomAnimation()}>
					<ButtonRadialGradient
						onPress={() => router.replace("/")}
						text="Continuer"
						color={themeColors[themeColor].primaryLight}
					/>
				</Animated.View>
			</LayoutBackground>
		</GestureDetector>
	);
}
