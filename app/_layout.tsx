import "react-native-reanimated";

import { DEFAULT_COLOR, DEFAULT_KEY_COLOR, themeColors } from "@/hooks/theme-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";


export default function RootLayout() {
	const [themeColor] = useMMKVString(DEFAULT_KEY_COLOR);
	const themeColorFinal = (themeColor as keyof typeof themeColors) ?? DEFAULT_COLOR;

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
