import Animated, { Easing, FadeInDown, useSharedValue, withTiming } from "react-native-reanimated";
import { PencilIcon, CameraIcon, CheckIcon } from "lucide-react-native";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { themeColors, useTheme } from "@/utils/theme-provider";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useEffect } from "react";


export default function Page() {
	const theme = useTheme();

	const animated = useSharedValue(0);
	const translateY = useSharedValue(-50);
	const translateX = useSharedValue(-50);
	const scale = useSharedValue(0.4);
	useEffect(() => {
		animated.value = withTiming(1, { duration: 800 });
		translateY.value = withTiming(0, { duration: 800 });
		translateX.value = withTiming(0, { duration: 800 });
		scale.value = withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1.0) });
	}, []);

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
				<Animated.View
					// key={index}
					style={[
						styles.containerProfile,
						{
							opacity: animated,
							transform: [{ translateY: translateY }, { translateX: translateX }, { scale: scale }],
						},
					]}
				>
					<Pressable
						style={StyleSheet.flatten([stylesLayout.shadowImage, styles.smallGap])}
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
				</Animated.View>
			</View>
		</LayoutBackground>
	);
}

const styles = StyleSheet.create({
	smallGap: {
		gap: 5,
	},
	containerProfiles: {
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
