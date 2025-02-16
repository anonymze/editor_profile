import { DEFAULT_COLOR, DEFAULT_IMAGE_URI, DEFAULT_KEY_COLOR, DEFAULT_KEY_IMAGE_URI, setStorageImageUri, themeColors, } from "@/utils/theme-storage";
import Animated, { FadeIn, FadeInDown, runOnJS, FadeOut, Easing } from "react-native-reanimated";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from "react-native";
import { GestureDetector, Gesture, Pressable } from "react-native-gesture-handler";
import { CheckIcon, CameraIcon, ArrowLeftIcon } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { CircleRadialGradient } from "@/components/radial-gradient";
import { InputTextGradient } from "@/components/text-gradient";
import { getKeysTypedObject } from "@/utils/helper";
import { useMMKVString } from "react-native-mmkv";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Image } from "expo-image";


const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Page() {
	const bottomButtonRef = useRef<Animated.View>(null);
	const inputRef = useRef<TextInput>(null);
	const [animating, setAnimating] = useState(true);
	const [imageUri, setImageUri] = useMMKVString(DEFAULT_KEY_IMAGE_URI);
	const [themeColor, setThemeColor] = useMMKVString(DEFAULT_KEY_COLOR);
	const themeColorFinal = (themeColor as keyof typeof themeColors) ?? DEFAULT_COLOR;

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
		const timeout = setTimeout(() => {
			inputRef.current?.focus();
		}, 1);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const handleThemeChange = useCallback(
		(color: keyof typeof themeColors) => {
			if (animating) return;
			setThemeColor(color);
		},
		[animating]
	);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.4,
			selectionLimit: 1,
		});

		if (result.canceled || result.assets[0].type !== "image") return;
		setStorageImageUri(result.assets[0].uri);
	};

	return (
		<GestureDetector gesture={panGesture}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1, backgroundColor: themeColors[themeColorFinal].primaryDark }}
				keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
			>
				<LayoutBackground color={themeColorFinal} centeredContent>
					<View style={stylesLayout.containerWithGap}>
						<Animated.View
							style={stylesLayout.centerContent}
							entering={FadeInDown.duration(800).delay(200).springify()}
						>
							<Pressable style={stylesLayout.shadowImage} onPress={pickImage}>
								<Image
									style={[stylesLayout.image]}
									contentFit="cover"
									source={imageUri ?? DEFAULT_IMAGE_URI}
								/>
								<View style={styles.cameraButton}>
									<CameraIcon fill={themeColors[themeColorFinal].primary} color="#fff" size={26} />
								</View>
							</Pressable>

							<CircleRadialGradient
								offset="80%"
								icon={null}
								color={themeColors[themeColorFinal].primary}
								style={StyleSheet.flatten([stylesLayout.gradientHalo, stylesLayout.bigHalo])}
							/>

							<CircleRadialGradient
								offset="80%"
								icon={null}
								color={themeColors[themeColorFinal].primary}
								style={StyleSheet.flatten([stylesLayout.gradientHalo, stylesLayout.smallHalo])}
							/>
						</Animated.View>

						<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
							<InputTextGradient color={themeColorFinal} style={{ fontSize: 55 }} ref={inputRef} />
						</Animated.View>
					</View>

					<Animated.View
						style={StyleSheet.flatten([
							stylesLayout.topButtons,
							stylesLayout.topRightButton,
							{
								backgroundColor: themeColors[themeColorFinal].secondary,
							},
						])}
						entering={FadeInDown.duration(800).delay(200).springify()}
					>
						<Pressable
							onPress={() => {
								router.push("/profile");
							}}
							style={stylesLayout.paddingTopButtons}
						>
							<ArrowLeftIcon size={28} color="#fff" />
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
								onPress={() => {
									handleThemeChange(color);
								}}
								key={color}
								icon={
									themeColorFinal === color ? (
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
		</GestureDetector>
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
	cameraButton: {
		width: 40,
		aspectRatio: 1,
		zIndex: 9,
		borderWidth: 1,
		borderColor: "#fff",
		position: "absolute",
		right: 2,
		top: 2,
		borderRadius: 99,
		backgroundColor: "rgba(255, 255, 255, 0.4)",
		boxShadow: "inset 0 0 9px 0 #fff",
		justifyContent: "center",
		alignItems: "center",
	},
	blurImage: {
		width: 140,
		aspectRatio: 1,
		position: "absolute",
		zIndex: 8,
		left: 0,
		top: 0,
		borderRadius: 99,
		opacity: 0.9,
	},
});
