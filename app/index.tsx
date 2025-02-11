import { ButtonGradient } from "@/components/button-gradient";
import { Pressable } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import useTheme from "@/utils/theme-provider";


export default function Index() {
	const theme = useTheme();
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: theme.color,
			}}
		>
			<Text>Edit szdzdzapp/index.tsx to edit this screen.</Text>
			<Pressable style={styles.bottomButton}><Text>Continuer</Text></Pressable>
			<Pressable style={[styles.topButtons, styles.topLeftButton]}><Text>+</Text></Pressable>
			<ButtonGradient style={[styles.topButtons, styles.topRightButton]}>+</ButtonGradient>
			<Pressable style={[styles.topButtons, styles.topMiddleButton]}><Text>+</Text></Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	topButtons: {
		position: "absolute",
		top: 25,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: 45,
		aspectRatio: 1,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "red",
	},
	topLeftButton: {
		left: 25,
	},
	topRightButton: {
		right: 25,
	},
	topMiddleButton: {
		left: "50%",
		transform: [{ translateX: "-50%" }],
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
});
