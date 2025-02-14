import { PencilIcon, CameraIcon, CheckIcon } from "lucide-react-native";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import Animated, { FadeInDown } from "react-native-reanimated";
import { themeColors, useTheme } from "@/utils/theme-provider";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";


export default function Page() {
	const theme = useTheme();
	return (
		<LayoutBackground color={theme.color} centeredContent={false}>
			<Animated.View
				style={StyleSheet.flatten([
					stylesLayout.topButtons,
					stylesLayout.topRightButton,
					{
						backgroundColor: themeColors[theme.color].secondary,
					},
				])}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable style={stylesLayout.paddingTopButtons} onPress={() => router.push("/profile-edit")}>
					<PencilIcon size={22} color="#fff" />
				</Pressable>
			</Animated.View>

			<View style={styles.containerProfiles}>
				{[1, 2, 3, 4].map((index) => (
					<View style={styles.containerProfile}>
						<Pressable
							style={[stylesLayout.shadowImage, { justifyContent: "center", alignItems: "center" }]}
							onPress={() => {
								console.log("pressed");
							}}
						>
							<View>
								<Image style={stylesLayout.image} source="https://picsum.photos/seed/696/3000/2000" />
								<View style={styles.checkmark}>
									<CameraIcon fill={themeColors[theme.color].primary} color="#fff" size={26} />
								</View>
							</View>

							<TextGradient style={{ fontSize: 20 }} color={theme.color} text="Nom du profil" />
						</Pressable>
					</View>
				))}
			</View>
		</LayoutBackground>
	);
}

const styles = StyleSheet.create({
	containerProfiles: {
		flex: 1,
		rowGap: 60,
		justifyContent: "space-between",
		flexDirection: "row",
		flexWrap: "wrap",
		width: "100%",
		paddingTop: 120,
	},
	containerProfile: {
		width: "50%",
		justifyContent: "center",
		alignItems: "center",
	},
	checkmark: {
		borderWidth: 1,
		borderColor: "#fff",
		width: 40,
		aspectRatio: 1,
		position: "absolute",
		right: 2,
		top: 2,
		borderRadius: 99,
		backgroundColor: "rgba(255, 255, 255, 0.4)",
		boxShadow: "inset 0 0 9px 0 #fff",
		justifyContent: "center",
		alignItems: "center",
	},
});
