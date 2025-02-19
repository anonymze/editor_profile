import "react-native-reanimated";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getStorageColor, themeColors } from "@/utils/theme-storage";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";


export default function RootLayout() {
	const themeColor = getStorageColor();
	return (
		<GestureHandlerRootView>
			<StatusBar style="light" />
			<SafeAreaProvider>
				<SafeAreaView
					edges={["right", "left", "top"]}
					style={{ flex: 1, backgroundColor: themeColors[themeColor].primaryLight }}
				>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: "none",
							headerStyle: {
								backgroundColor: "#007AFF", // This will show through the status bar
							},
							contentStyle: {
								backgroundColor: "#A020F0", // Same purple color
							},
							headerTintColor: "green",
						}}
					>
						<Stack.Screen options={{ animation: "fade" }} name="recipe" />
					</Stack>
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
