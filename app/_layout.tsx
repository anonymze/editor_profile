import "react-native-reanimated";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";


export default function RootLayout() {
	return (
		<GestureHandlerRootView>
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1 }}>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: "none",
						}}
					>
					</Stack>
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
