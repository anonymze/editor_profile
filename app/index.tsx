import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { InputTextGradient, TextGradient } from "@/components/text-gradient";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { PlusIcon, PencilIcon } from "lucide-react-native";
import { Pressable } from "react-native-gesture-handler";
import LayoutBackground from "@/layout/background";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useRef } from "react";


export default function Index() {
	return (
		<LayoutBackground
			centeredContent
			onLayout={() => {
				// inputRef.current?.focus();
			}}
		>
			<View id="container" style={styles.container}>
				<Animated.View entering={FadeInDown.duration(800).delay(200).springify()}>
					<Image style={styles.image} source="https://picsum.photos/seed/696/3000/2000" />
				</Animated.View>
				<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
					<TextGradient text={"Coufefcou"} style={{ fontSize: 60 }} />
				</Animated.View>
			</View>

			<Animated.View
				style={[styles.topButtons, styles.topLeftButton]}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable>
					<PlusIcon size={28} color="#fff" />
				</Pressable>
			</Animated.View>
			<Animated.View
				style={[styles.topButtons, styles.topRightButton]}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable style={[styles.container, styles.paddingTopButtons]} onPress={() => router.push("/edit")}>
					<PencilIcon size={22} color="#fff" />
				</Pressable>
			</Animated.View>

			<Animated.View style={styles.bottomButton} entering={FadeInDown.duration(500).delay(300)}>
				<Pressable>
					<Text>Continuer</Text>
				</Pressable>
			</Animated.View>
		</LayoutBackground>
	);
}

const styles = StyleSheet.create({
	topButtons: {
		position: "absolute",
		top: 35,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: 45,
		aspectRatio: 1,
		borderRadius: 12,
		backgroundColor: "#1487ff",
		boxShadow: "inset 0 0 8px 0 #fff",
	},
	topLeftButton: {
		left: 30,
	},
	topRightButton: {
		right: 30,
	},
	topMiddleButton: {
		left: "50%",
		transform: [{ translateX: "-50%" }],
	},
	image: {
		width: 130,
		aspectRatio: 1,
		borderRadius: 99,
		marginBottom: 3,
	},
	bottomButton: {
		position: "absolute",
		bottom: 50,
		width: "100%",
		maxWidth: 300,
		borderRadius: 99,
		padding: 16,
		backgroundColor: "red",
		borderTopColor: "#fff",
		borderTopWidth: 2,
		color: "#fff",
		alignItems: "center",
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	paddingTopButtons: {
		paddingBlock: 30,
		paddingHorizontal: 20,
	},
});
