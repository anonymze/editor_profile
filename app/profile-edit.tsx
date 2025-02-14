import Animated, { FadeIn, FadeInDown, runOnJS, FadeOut, Easing, useSharedValue, withTiming, withRepeat, useAnimatedStyle, } from "react-native-reanimated";
import { AnimatedCircleRadialGradient, CircleRadialGradient } from "@/components/radial-gradient";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View, } from "react-native";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { XIcon, CheckIcon, CameraIcon } from "lucide-react-native";
import { useTheme, themeColors } from "@/utils/theme-provider";
import { InputTextGradient } from "@/components/text-gradient";
import ImagePickerExample from "@/components/image-picker";
import { Pressable } from "react-native-gesture-handler";
import { getKeysTypedObject } from "@/utils/helper";
import { router } from "expo-router";
import { Image } from "expo-image";


export default function Page() {
	const inputRef = useRef<TextInput>(null);
	const [animating, setAnimating] = useState(true);
	const theme = useTheme();
	const bottomButtonRef = useRef<Animated.View>(null);

	console.log(theme.name);
	

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1, backgroundColor: themeColors[theme.color].primaryDark }}
			keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
		>

		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	buttons: {
		flexDirection: "row",
		gap: 17,
		padding: 8,
		borderWidth: 1,
		borderColor: "#fff",
		maxWidth: "100%",
		width: "auto",
		backgroundColor: "rgba(195, 176, 180, 0.7)",
	},
	cameraButton: {
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
