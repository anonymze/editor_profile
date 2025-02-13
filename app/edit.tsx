import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { InputTextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { XIcon, CheckIcon } from "lucide-react-native";
import LayoutBackground from "@/layout/background";
import { stylesLayout } from "@/layout/background";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useRef } from "react";


export default function Index() {
	const inputRef = useRef<TextInput>(null);

	return (
		<LayoutBackground
			centeredContent
			onLayout={() => {
				inputRef.current?.focus();
			}}
		>
			<View id="container" style={stylesLayout.container}>
				<Animated.View
					style={[styles.shadowImage]}
					entering={FadeInDown.duration(800).delay(200).springify()}
				>
					<Image style={stylesLayout.image} source="https://picsum.photos/seed/696/3000/2000" />
				</Animated.View>
				<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
					<InputTextGradient text={"Coucou"} style={{ fontSize: 60 }} ref={inputRef} maxLength={8} />
				</Animated.View>
			</View>
			<Animated.View
				style={[stylesLayout.topButtons, stylesLayout.topLeftButton]}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable
					style={stylesLayout.paddingTopButtons}
					onPress={() => {
						router.push("/");
					}}
				>
					<XIcon size={28} color="#fff" />
				</Pressable>
			</Animated.View>
			<Animated.View
				style={[stylesLayout.topButtons, stylesLayout.topRightButton]}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable style={stylesLayout.paddingTopButtons}>
					<CheckIcon size={28} color="#fff" />
				</Pressable>
			</Animated.View>

			<Animated.View
				style={[stylesLayout.bottomButton, styles.buttons]}
				entering={FadeInDown.duration(500).delay(300)}
			>
				<Pressable style={styles.buttonColor}></Pressable>
				<Pressable style={styles.buttonColor}></Pressable>
				<Pressable style={styles.buttonColor}></Pressable>
				<Pressable style={styles.buttonColor}></Pressable>
				<Pressable style={styles.buttonColor}></Pressable>
			</Animated.View>
		</LayoutBackground>
	);
}

const styles = StyleSheet.create({
	buttons: {
		flexDirection: "row",
		gap: 15,
		padding: 8,
		borderWidth: 1,
		borderColor: "#fff",
		maxWidth: "auto",
		width: "auto",
		backgroundColor: "rgba(255, 255, 255, 0.4)",
	},
	buttonColor: {
		justifyContent: "center",
		alignItems: "center",
		width: 40,
		aspectRatio: 1,
		borderWidth: 1,
		borderColor: "#fff",
		borderRadius: 99,
		shadowColor: "#000",
		shadowOffset: {
			width: -1,
			height: 1,
		},
		shadowOpacity: 1,
		shadowRadius: 3,
	},
	shadowImage: {
		shadowColor: "#000",
		shadowOffset: { width: -1, height: 1 },
		shadowOpacity: 0.3,
		shadowRadius: 2,
	},
});
