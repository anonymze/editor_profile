import "react-native-reanimated";

import { DEFAULT_COLOR, DEFAULT_KEY_COLOR, themeColors } from "@/utils/theme-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";


export default function RootLayout() {
	const [themeColor] = useMMKVString(DEFAULT_KEY_COLOR);

	return (
		<GestureHandlerRootView>
			<StatusBar style="light" />
			<SafeAreaProvider>
				<SafeAreaView
					edges={["right", "left", "top"]}
					style={{ flex: 1, backgroundColor: themeColors[themeColor ?? DEFAULT_COLOR].primaryLight }}
				>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: "none",
						}}
					>
						<Stack.Screen options={{ animation: "fade" }} name="recipe" />
					</Stack>
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
