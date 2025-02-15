import Animated, { FadeIn, FadeInDown, runOnJS, FadeOut, Easing, useSharedValue, withTiming, } from "react-native-reanimated";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from "react-native";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { CircleRadialGradient } from "@/components/radial-gradient";
import { XIcon, CheckIcon, CameraIcon } from "lucide-react-native";
import { useTheme, themeColors } from "@/utils/theme-provider";
import { InputTextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { getKeysTypedObject } from "@/utils/helper";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Image } from "expo-image";


const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Page() {
	const theme = useTheme();
	const bottomButtonRef = useRef<Animated.View>(null);
	const inputRef = useRef<TextInput>(null);
	const [animating, setAnimating] = useState(true);
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
			theme.setTheme(color);
		},
		[animating, theme]
	);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled && result.assets[0].type === "image") {
			theme.setImageUri(result.assets[0].uri);
		}
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
							<View>
								<Image
									style={stylesLayout.image}
									placeholder={"https://picsum.photos/seed/696/3000/2000" }
									placeholderContentFit="cover"
									contentFit="cover"
									source={theme.imageUri ? { uri: theme.imageUri } : "https://picsum.photos/seed/696/3000/2000"}
								/>
							</View>
							<View style={styles.cameraButton}>
								<CameraIcon fill={themeColors[theme.color].primary} color="#fff" size={26} />
							</View>
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
							text={theme.name}
							style={{ fontSize: 58 }}
							ref={inputRef}
							maxLength={12}
							setName={theme.setName}
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
		borderWidth: 1,
		borderColor: "#fff",
		width: 40,
		aspectRatio: 1,
		position: "absolute",
		zIndex: 9,
		right: 2,
		top: 2,
		borderRadius: 99,
		backgroundColor: "rgba(255, 255, 255, 0.4)",
		boxShadow: "inset 0 0 9px 0 #fff",
		justifyContent: "center",
		alignItems: "center",
	},
});
