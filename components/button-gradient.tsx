import { Pressable, PressableProps, StyleSheet, Text } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";


export function ButtonGradient(props: PressableProps & { children: React.ReactNode }) {
	return (
		<Pressable {...props}>
			<LinearGradient colors={["#000", "#fff"]} style={styles.button}>
				<Text style={styles.text}>{props.children}</Text>
			</LinearGradient>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		borderRadius: 99,
		padding: 16,
		backgroundColor: "red",
	},
	text: {
		color: "#fff",
	},
});
