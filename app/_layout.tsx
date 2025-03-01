import "react-native-reanimated";

import { DEFAULT_COLOR, DEFAULT_KEY_COLOR, themeColors } from "@/theme/theme-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { useMMKVString } from "react-native-mmkv";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
	fade: true,
	duration: 200,
});

export default function RootLayout() {
	const [themeColor] = useMMKVString(DEFAULT_KEY_COLOR);
	const themeColorFinal = (themeColor as keyof typeof themeColors) ?? DEFAULT_COLOR;
	const [loaded] = useFonts({
		// AtkinsonRegular: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Regular-102a.woff2"),
		// AtkinsonBold: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Bold-102a.woff2"),
		// AtkinsonItalic: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Italic-102a.woff2"),
	});

	React.useEffect(() => {
		if (loaded) SplashScreen.hideAsync();
	}, [loaded]);

	return (
		<GestureHandlerRootView>
			<StatusBar style="light" translucent />
			<SafeAreaProvider>
				<SafeAreaView
					edges={["right", "left", "top"]}
					style={{ flex: 1, backgroundColor: themeColors[themeColorFinal].primaryLight }}
				>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: "none",
						}}
					>
						<Stack.Screen options={{ animation: "fade_from_bottom" }} name="recipe" />
						<Stack.Screen options={{ animation: "fade_from_bottom" }} name="index" />
					</Stack>
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
