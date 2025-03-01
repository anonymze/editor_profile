import { DEFAULT_IMAGE_URI, getStorageColor, getStorageImageUri, getStorageName, themeColors, } from "@/hooks/theme-storage";
import { PlusIcon, PencilIcon, ArrowLeftIcon, UserRoundPenIcon } from "lucide-react-native";
import { ButtonRadialGradient, CircleRadialGradient } from "@/components/radial-gradient";
import { Gesture, GestureDetector, Pressable } from "react-native-gesture-handler";
import Animated, { Easing, FadeInDown, runOnJS } from "react-native-reanimated";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { TextGradient } from "@/components/text-gradient";
import { StyleSheet, View, Platform } from "react-native";
import { useCallback, useMemo } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";


export default function Page() {
	const themeColor = getStorageColor();

	const panGesture = useMemo(
		() =>
			Gesture.Pan()
				.activeOffsetX([-20, 20])
				.onEnd((event) => {
					// swipe left only
					if (event.translationX > 50) {
						runOnJS(router.push)("/");
					}
				}),
		[]
	);

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
		<GestureDetector gesture={panGesture}>
			{Platform.OS === 'android' ? (
				<View collapsable={false} style={stylesLayout.flex}>
					<LayoutBackground centeredContent color={themeColor}>
						<View style={stylesLayout.containerWithGap}>
							<Animated.View
								style={stylesLayout.centerContent}
								entering={FadeInDown.duration(800).delay(200).springify()}
							>
								<View style={stylesLayout.shadowImage}>
									<Image
										style={stylesLayout.image}
										source={getStorageImageUri()}
										contentFit="cover"
										placeholder={{ uri: DEFAULT_IMAGE_URI }}
										placeholderContentFit="cover"
										transition={{
											duration: 100,
											effect: "cross-dissolve",
										}}
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

						<Animated.View style={stylesLayout.bottomButton} entering={enteringAnimation()}>
							<ButtonRadialGradient
								onPress={() => router.push("/")}
								text="Continuer"
								color={themeColors[themeColor].primaryLight}
							/>
						</Animated.View>
					</LayoutBackground>
				</View>
			) : (
				<LayoutBackground centeredContent color={themeColor}>
					<View style={stylesLayout.containerWithGap}>
						<Animated.View
							style={stylesLayout.centerContent}
							entering={FadeInDown.duration(800).delay(200).springify()}
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

					<Animated.View style={stylesLayout.bottomButton} entering={enteringAnimation()}>
						<ButtonRadialGradient
							onPress={() => router.push("/")}
							text="Continuer"
							color={themeColors[themeColor].primaryLight}
						/>
					</Animated.View>
				</LayoutBackground>
			)}
		</GestureDetector>
	);
}
