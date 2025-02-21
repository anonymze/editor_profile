import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing, withSequence, withSpring, FadeOut } from "react-native-reanimated";
import { stylesLayout } from "@/layout/background";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useEffect } from "react";


export default function SplashScreenAnimation() {
	const rotation = useSharedValue(0);

	useEffect(() => {
		rotation.value = withRepeat(
			withSequence(
				withTiming(-30, { duration: 160, easing: Easing.out(Easing.ease) }),
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
			<Animated.View style={StyleSheet.flatten([stylesLayout.container, rStyle])}>
				<Image
					style={[stylesLayout.imageRecipe]}
					source={require("@/assets/images/fridge.png")}
					cachePolicy="memory-disk"
					contentFit="contain"
				/>
			</Animated.View>
	);
}

