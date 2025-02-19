import "react-native-reanimated";

import { DEFAULT_COLOR, DEFAULT_KEY_COLOR, themeColors } from "@/utils/theme-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Stack } from "expo-router";


export default function RootLayout() {
	const [themeColor] = useMMKVString(DEFAULT_KEY_COLOR);
	const themeColorFinal = (themeColor as keyof typeof themeColors) ?? DEFAULT_COLOR;

	return (
		<GestureHandlerRootView>
			<SafeAreaProvider>
				<SafeAreaView
					edges={["right", "left", "top"]}
					style={{ flex: 1, backgroundColor: themeColors[themeColorFinal].primaryLight }}
				>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: "none",
							statusBarBackgroundColor: themeColors[themeColorFinal].primaryLight
						}}
					>
						<Stack.Screen options={{ animation: "fade" }} name="recipe" />
					</Stack>
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
