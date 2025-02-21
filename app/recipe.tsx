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


export default function Page() {
	const themeColor = getStorageColor();
	const [splashScreen, setSplashScreen] = useState(true);
	const [response, setResponse] = useState("");
	const { prompt, vendorId } = useLocalSearchParams();

	useEffect(() => {
		const abortController = new AbortController();
		const fetchRecipe = async () => {
			try {
				const response = await fetch(
					`${
						process.env.NODE_ENV === "development" ? "http://localhost:8081" : process.env.EXPO_PUBLIC_API_URL
					}${process.env.EXPO_PUBLIC_API_URL_RECIPE_URL}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"X-Origin": Application.applicationName ?? "",
							"X-Vendor-Id": vendorId?.toString() ?? "",
						},
						body: JSON.stringify({
							username: getStorageName(),
							prompt: prompt.toString(),
						}),
						signal: abortController.signal,
					}
				);

				setResponse(await response.text());
				setSplashScreen(false);
				setStorageLimitedAction(getStorageLimitedAction() - 1);
			} catch (error) {
				console.log(error);
				if (error instanceof Error && error.name === "AbortError") return;

				Alert.alert("Erreur", "Un problème est survenu lors de la génération de la recette.", [
					{ text: "OK" },
				]);
				router.back();
			}
		};

		fetchRecipe();

		return () => {
			abortController.abort();
		};
	}, []);

	const panGesture = useMemo(
		() =>
			Gesture.Pan()
				.activeOffsetX([-20, 20])
				.onEnd((event) => {
					if (event.translationX > 50) {
						runOnJS(router.back)();
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
							router.back();
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
							<Text style={styles.containerText}>{response}</Text>
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
