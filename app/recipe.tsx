import SplashScreenAnimation from "@/components/splashscreen-animation";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { Alert, Platform, StyleSheet, Text } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { getStorageColor } from "@/utils/theme-storage";
import { fetch as expoFetch } from "expo/fetch";
import { useCompletion } from "@ai-sdk/react";
import { useEffect, useState } from "react";


export default function Page() {
	const themeColor = getStorageColor();
	const [splashScreen, setSplashScreen] = useState(true);
	const { prompt, vendorId } = useLocalSearchParams();
	const { complete, completion, isLoading } = useCompletion({
		fetch: expoFetch as unknown as typeof globalThis.fetch,
		api: process.env.EXPO_PUBLIC_API_RECIPE_URL || "",
		headers: {
			"X-Origin": "fridgy",
			"X-Vendor-Id": vendorId?.toString() ?? "",
		},
		onError: (_) => {
			setTimeout(() => {
				setSplashScreen(false);
				Alert.alert(
					"Erreur",
					"Un problème est survenu lors de la génération de la recette",
					[{ text: "OK" }]
				);
				router.push("/");
			}, 800);
		},
	});

	console.log(vendorId);

	useEffect(() => {
		complete(prompt.toString());
		setTimeout(() => {
			setSplashScreen(false);
		}, 3500);
	}, []);

	return (
		<LayoutBackground color={themeColor} centeredContent={false}>
			{splashScreen ? (
				<Animated.View
					style={stylesLayout.container}
					exiting={FadeOut.duration(400)}
				>
					<SplashScreenAnimation />
				</Animated.View>
			) : (
				<ScrollView style={{ flex: 1 }}>
					<Text>{completion}</Text>
				</ScrollView>
			)}
		</LayoutBackground>
	);
}
