import Animated, { Easing, FadeInDown, useSharedValue, withTiming, useAnimatedStyle, interpolate, withSpring, withDelay, } from "react-native-reanimated";
import { PencilIcon, CameraIcon, CheckIcon } from "lucide-react-native";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { getStorageColor, themeColors } from "@/hooks/theme-storage";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useEffect } from "react";


export default function Page() {
	const animation = useSharedValue(0);
	const themeColor = getStorageColor();

	useEffect(() => {
		animation.value = withTiming(1, { duration: 500 });
	}, []);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: animation.value,
		transform: [
			{
				translateY: withSpring(interpolate(animation.value, [0, 1], [-180, 0]), { damping: 13 }),
			},
			{
				translateX: interpolate(animation.value, [0, 1], [50, 0]),
			},
			{
				scale: interpolate(animation.value, [0, 1], [0, 1]),
			},
		],
	}));

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

			<View style={styles.containerProfiles}>
				<Animated.View style={[styles.gridItem, animatedStyle]}>
					<Pressable
						style={StyleSheet.flatten([stylesLayout.shadowImage, styles.smallGap])}
						onPress={() => {
						}}
					>
						<View>
							<Image style={stylesLayout.image} source="https://picsum.photos/seed/696/3000/2000" />
							<View style={styles.checkmark}>
								<CameraIcon fill={themeColors[themeColor].primary} color="#fff" size={26} />
							</View>
						</View>

						<TextGradient style={{ fontSize: 20 }} color={themeColor} text="Nom du profil" />
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
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		width: "100%",
	},
	gridItem: {
		width: "50%",
		justifyContent: "center",
		alignItems: "center",
	},
});
