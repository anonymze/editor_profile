import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing, withSequence, withDelay, withSpring } from "react-native-reanimated";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { getStorageColor } from "@/utils/theme-storage";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useEffect } from "react";


export default function Page() {
	const themeColor = getStorageColor();
	const rotation = useSharedValue(0);

	useEffect(() => {
		rotation.value = withRepeat(
			withSequence(
				withTiming(-30, { duration: 120, easing: Easing.out(Easing.ease) }),
				withSpring(360, { damping: 7, stiffness: 60, mass: 0.4 }),
			),
			-1,
			false
		);
	}, []);

	const rStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${rotation.value}deg` }],
		};
	});

	return (
		<LayoutBackground color={themeColor} centeredContent={false}>
			<Animated.View style={[stylesLayout.container, rStyle]}>
				<Image
					style={[stylesLayout.imageRecipe]}
					source={require("@/assets/images/fridge.png")}
					cachePolicy="memory-disk"
					contentFit="contain"
				/>
			</Animated.View>
		</LayoutBackground>
	);
}

const styles = StyleSheet.create({});
