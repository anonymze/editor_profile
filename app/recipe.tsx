import SplashScreenAnimation from "@/components/splashscreen-animation";
import Animated, { FadeOut } from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { getStorageColor } from "@/utils/theme-storage";
import LayoutBackground from "@/layout/background";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { fetch as expoFetch } from "expo/fetch";
import { useCompletion } from "@ai-sdk/react";
import { useEffect, useState } from "react";


export default function Page() {
	const themeColor = getStorageColor();
	const [splashScreen, setSplashScreen] = useState(true);
	const { prompt } = useLocalSearchParams();
	const { complete, completion, isLoading } = useCompletion({
		fetch: expoFetch as unknown as typeof globalThis.fetch,
		api: process.env.EXPO_PUBLIC_API_RECIPE_URL,
		onError: (error) => console.error(error, "ERROR"),
	});

	console.log(prompt);
	console.log(completion);
	console.log(isLoading);

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
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
					exiting={FadeOut.duration(1000)}
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
