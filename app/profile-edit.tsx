import Animated, { FadeIn, FadeInDown, runOnJS, FadeOut, Easing, useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from "react-native";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { getStorageName, setStorageName } from "@/utils/theme-storage";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { CircleRadialGradient } from "@/components/radial-gradient";
import { XIcon, CheckIcon, CameraIcon } from "lucide-react-native";
import { useTheme, themeColors } from "@/utils/theme-provider";
import { launchImageLibrary } from 'react-native-image-picker';
import { InputTextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { getKeysTypedObject } from "@/utils/helper";
import { router } from "expo-router";
import { Image } from "expo-image";


const AnimatedImage = Animated.createAnimatedComponent(Image);

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Page() {
	const theme = useTheme();
	const bottomButtonRef = useRef<Animated.View>(null);
	const inputRef = useRef<TextInput>(null);
	const [animating, setAnimating] = useState(true);
	const [imageLoading, setImageLoading] = useState(false);
	const oldImageUri = useRef(theme.imageUri);
	const newImageOpacity = useSharedValue(1);
	const oldImageOpacity = useSharedValue(0);

	const newImageAnimatedStyle = useAnimatedStyle(() => ({
		opacity: newImageOpacity.value
	}));

	const oldImageAnimatedStyle = useAnimatedStyle(() => ({
		opacity: oldImageOpacity.value
	}));


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

	useEffect(() => {
		if (imageLoading) {
			oldImageOpacity.value = 1;
			newImageOpacity.value = 0;
		}
	}, [imageLoading]);

	const handleThemeChange = useCallback(
		(color: keyof typeof themeColors) => {
			if (animating) return;
			theme.setTheme(color);
		},
		[animating, theme]
	);

	const pickImage = async () => {
		const result = await launchImageLibrary({
			mediaType: 'photo',
			selectionLimit: 1,
			includeBase64: false,
			includeExtra: false,
			presentationStyle: 'pageSheet',
			quality: 0.4,
		});

		if (result.didCancel || !result.assets?.[0].uri) return;

		setImageLoading(true);
		oldImageUri.current = theme.imageUri;
		theme.setImageUri(result.assets[0].uri);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1, backgroundColor: themeColors[theme.color].primaryDark }}
			keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
		>
			<LayoutBackground color={theme.color} centeredContent>
				<View style={stylesLayout.container}>
					<Animated.View
						style={stylesLayout.centerContent}
						entering={FadeInDown.duration(800).delay(200).springify()}
					>
						<Pressable style={stylesLayout.shadowImage} onPress={pickImage}>
							<AnimatedImage								
								onLoad={() => {
									if (imageLoading) {
										oldImageOpacity.value = withTiming(0, { duration: 1000 });
										newImageOpacity.value = withTiming(1, { duration: 1000 });
										setImageLoading(false);
									}
								}}
								style={[stylesLayout.image, newImageAnimatedStyle]}
								placeholder={{ blurhash }}
								placeholderContentFit="cover"
								contentFit="cover"
								source={theme.imageUri ? { uri: theme.imageUri } : undefined}
							/>
							<View style={styles.cameraButton}>
								<CameraIcon fill={themeColors[theme.color].primary} color="#fff" size={26} />
							</View>

							{oldImageUri.current && <AnimatedImage 
								style={[styles.blurImage, oldImageAnimatedStyle]} 
								source={{ uri: oldImageUri.current }}
								contentFit="cover"
							/>}
						</Pressable>

						<CircleRadialGradient
							offset="80%"
							icon={null}
							color={themeColors[theme.color].primary}
							style={StyleSheet.flatten([stylesLayout.gradientHalo, stylesLayout.bigHalo])}
						/>

						<CircleRadialGradient
							offset="80%"
							icon={null}
							color={themeColors[theme.color].primary}
							style={StyleSheet.flatten([stylesLayout.gradientHalo, stylesLayout.smallHalo])}
						/>
					</Animated.View>

					<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
						<InputTextGradient
							color={theme.color}
							text={getStorageName()}
							style={{ fontSize: 55 }}
							ref={inputRef}
							maxLength={12}
							setName={(name) => setStorageName(name)}
						/>
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
					style={StyleSheet.flatten([
						stylesLayout.topButtons,
						stylesLayout.topRightButton,
						{
							backgroundColor: themeColors[theme.color].secondary,
						},
					])}
					entering={FadeInDown.duration(800).delay(200).springify()}
				>
					<Pressable
						onPress={() => {
							router.push("/");
						}}
						style={stylesLayout.paddingTopButtons}
					>
						<CheckIcon size={28} color="#fff" />
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
								theme.color === color ? (
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
