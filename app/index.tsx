import LayoutBackground, { stylesLayout } from "@/layout/background";
import { getStorageColor, themeColors } from "@/utils/theme-storage";
import Animated, { FadeInDown } from "react-native-reanimated";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { PencilIcon } from "lucide-react-native";
import { router } from "expo-router";


export default function Page() {

	const themeColor = getStorageColor();


	return (
		<LayoutBackground color={themeColor} centeredContent={false}>
			<Animated.View
				style={StyleSheet.flatten([
					stylesLayout.topButtons,
					stylesLayout.topRightButton,
					{
						backgroundColor: themeColors[themeColor].secondary,
					},
				])}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable style={stylesLayout.paddingTopButtons} onPress={() => router.push("/profile-edit")}>
					<PencilIcon size={22} color="#fff" />
				</Pressable>
			</Animated.View>


			<View style={styles.container}>
				<TextGradient  color={themeColor} text="Hello" />
			</View>


		</LayoutBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
