import { getStorageColor, getStorageLimitedAction, getStorageName, setStorageLimitedAction, themeColors, } from "@/utils/theme-storage";
import { Gesture, GestureDetector, Pressable, ScrollView } from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeOut, runOnJS } from "react-native-reanimated";
import SplashScreenAnimation from "@/components/splashscreen-animation";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { Alert, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon } from "lucide-react-native";
import * as Application from "expo-application";
import { fetch as expoFetch } from "expo/fetch";
import { useCompletion } from "@ai-sdk/react";


export default function Page() {
	const themeColor = getStorageColor();
	const [splashScreen, setSplashScreen] = useState(true);
	const { prompt, vendorId } = useLocalSearchParams();
	const { complete, completion, stop, isLoading } = useCompletion({
		fetch: expoFetch as unknown as typeof globalThis.fetch,
		api: `${
			process.env.NODE_ENV === "development" ? "http://localhost:8081" : process.env.EXPO_PUBLIC_API_URL
		}${process.env.EXPO_PUBLIC_API_URL_RECIPE_URL}`,
		headers: {
			"X-Origin": Application.applicationName ?? "",
			"X-Vendor-Id": vendorId?.toString() ?? "",
		},
		body: {
			username: getStorageName(),
		},
		onError: (error) => {
			if (!error.message.includes("request has been canceled")) {
				Alert.alert("Erreur", "Un problème est survenu lors de la génération de la recette", [
					{ text: "OK" },
				]);
			}

			router.push("/");
		},
		onResponse: () => setSplashScreen(false),
		onFinish: () => setStorageLimitedAction(getStorageLimitedAction() - 1),
	});


	useEffect(() => {
		complete(prompt.toString());
	}, []);

	const panGesture = useMemo(
		() =>
			Gesture.Pan()
				.activeOffsetX([-20, 20])
				.onEnd((event) => {
					// swipe left only
					if (event.translationX > 50) {
						if (isLoading) {
							runOnJS(stop)();
							return;
						}
						runOnJS(router.push)("/");
					}
				}),
		[]
	);

	return (
		<GestureDetector gesture={panGesture}>
			<LayoutBackground color={themeColor} centeredContent={false}>
				<Animated.View
					style={StyleSheet.flatten([
						stylesLayout.topButtons,
						stylesLayout.topRightButton,
						{
							backgroundColor: themeColors[themeColor].secondary,
							zIndex: 1000,
						},
					])}
					entering={FadeInDown.duration(800).delay(200).springify()}
				>
					<Pressable
						onPress={() => {
							if (isLoading) {
								stop();
								return;
							}
							router.push("/");
						}}
						style={stylesLayout.paddingTopButtons}
					>
						<ArrowLeftIcon size={26} color="#fff" />
					</Pressable>
				</Animated.View>
				{splashScreen ? (
					<Animated.View style={stylesLayout.container} exiting={FadeOut.duration(400)}>
						<SplashScreenAnimation />
					</Animated.View>
				) : (
					<ScrollView style={stylesLayout.flex}>
						<View style={styles.containerPrompt}>
							<Text style={styles.containerText}>{completion}</Text>
						</View>
					</ScrollView>
				)}
			</LayoutBackground>
		</GestureDetector>
	);
}

const styles = StyleSheet.create({
	containerPrompt: {
		flex: 1,
		paddingTop: 100,
		paddingBottom: 40,
		paddingHorizontal: 18,
	},
	containerText: {
		fontSize: 18,
		color: "#000",
	},
});
