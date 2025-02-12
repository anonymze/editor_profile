import { StyleSheet, Text, TextInput, View } from "react-native";
import { InputTextGradient } from "@/components/text-gradient";
import { PlusIcon, PencilIcon } from "lucide-react-native";
import { Pressable } from "react-native-gesture-handler";
import LayoutBackground from "@/layout/background";
import useTheme from "@/utils/theme-provider";
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
			<View id="container" style={styles.container}>
				<Image style={styles.image} source="https://picsum.photos/seed/696/3000/2000" />
				<InputTextGradient text={"Coucou"} style={{ fontSize: 60 }} ref={inputRef} maxLength={8} />
			</View>

			<Pressable style={styles.bottomButton}>
				<Text>Continuer</Text>
			</Pressable>
			<Pressable style={[styles.topButtons, styles.topLeftButton]}>
				<PlusIcon size={28} color="#fff" />
			</Pressable>
			<Pressable style={[styles.topButtons, styles.topRightButton]}>
				<PencilIcon size={22} color="#fff" />
			</Pressable>
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
		width: 125,
		aspectRatio: 1,
		borderRadius: 99,
	},
	bottomButton: {
		position: "absolute",
		bottom: 50,
		left: "50%",
		transform: [{ translateX: "-50%" }],
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
});
