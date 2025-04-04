import "react-native-reanimated";

import { DEFAULT_COLOR, DEFAULT_KEY_COLOR, themeColors } from "@/theme/theme-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { CustomerProvider, useCustomer } from "@/context/customer";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { getCustomerAppStore } from "@/utils/in-app-purchase";
import * as SplashScreen from "expo-splash-screen";
import { useMMKVString } from "react-native-mmkv";
import { LogBox, Platform } from "react-native";
import * as Sentry from "@sentry/react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";


const WEB_FONT_STACK =
	'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

Sentry.init({
	dsn: "https://2f333f7f1fee3d45eb91b8a9bf66ad26@o4509069379043328.ingest.de.sentry.io/4509069385728080",
	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: __DEV__,
});

const apiKeyRevenueCat = Platform.select({
	ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
	android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
});

// keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
	fade: true,
	duration: 200,
});

// ignore warning logs
LogBox.ignoreLogs(["Warning: ..."]);

export default Sentry.wrap(function RootLayout() {
	const [customerLoaded, setCustomerLoaded] = React.useState(false);
	const [themeColor] = useMMKVString(DEFAULT_KEY_COLOR);
	const themeColorFinal = (themeColor as keyof typeof themeColors) ?? DEFAULT_COLOR;
	const [loaded] = useFonts({
		// AtkinsonRegular: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Regular-102a.woff2"),
		// AtkinsonBold: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Bold-102a.woff2"),
		// AtkinsonItalic: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Italic-102a.woff2"),
	});
	const { setCustomer } = useCustomer();

	// initialize RevenueCat (can do it only when component is mounted)
	React.useEffect(() => {
		Purchases.configure({ apiKey: apiKeyRevenueCat || "" });
		Purchases.setLogLevel(LOG_LEVEL.ERROR);

		const fetchAsync = async () => {
			const customer = await getCustomerAppStore();
			setCustomer(customer);
			setCustomerLoaded(true);
		};

		fetchAsync();
	}, []);

	React.useEffect(() => {
		if (loaded && customerLoaded) SplashScreen.hideAsync();
	}, [loaded, customerLoaded]);

	if (!loaded || !customerLoaded) return null;

	return (
		<CustomerProvider>
			<GestureHandlerRootView>
				<KeyboardProvider>
					<SafeAreaProvider>
						<ThemeProvider
							value={{
								dark: false,
								colors: {
									primary: "rgb(10, 132, 255)",
									background: "rgb(1, 1, 1)",
									card: "rgb(18, 18, 18)",
									text: "rgb(229, 229, 231)",
									border: "rgb(39, 39, 41)",
									notification: "rgb(255, 69, 58)",
								},
								fonts: Platform.select({
									web: {
										regular: {
											fontFamily: WEB_FONT_STACK,
											fontWeight: "400",
										},
										medium: {
											fontFamily: WEB_FONT_STACK,
											fontWeight: "500",
										},
										bold: {
											fontFamily: WEB_FONT_STACK,
											fontWeight: "600",
										},
										heavy: {
											fontFamily: WEB_FONT_STACK,
											fontWeight: "700",
										},
									},
									ios: {
										regular: {
											fontFamily: "System",
											fontWeight: "400",
										},
										medium: {
											fontFamily: "System",
											fontWeight: "500",
										},
										bold: {
											fontFamily: "System",
											fontWeight: "600",
										},
										heavy: {
											fontFamily: "System",
											fontWeight: "700",
										},
									},
									default: {
										regular: {
											fontFamily: "sans-serif",
											fontWeight: "normal",
										},
										medium: {
											fontFamily: "sans-serif-medium",
											fontWeight: "normal",
										},
										bold: {
											fontFamily: "sans-serif",
											fontWeight: "600",
										},
										heavy: {
											fontFamily: "sans-serif",
											fontWeight: "700",
										},
									},
								}),
							}}
						>
							<StatusBar translucent style="light" />
							<SafeAreaView
								edges={["right", "left", "top"]}
								style={{ flex: 1 }}
							>
								<Stack
									screenOptions={{
										headerShown: false,
										animation: "none",
									}}
								>
									<Stack.Screen options={{ animation: "fade_from_bottom" }} name="recipe" />
								</Stack>
							</SafeAreaView>
						</ThemeProvider>
					</SafeAreaProvider>
				</KeyboardProvider>
			</GestureHandlerRootView>
		</CustomerProvider>
	);
});
