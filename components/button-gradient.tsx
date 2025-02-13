import { Pressable, PressableProps } from "react-native-gesture-handler";
import { LinearGradient } from "react-native-linear-gradient";
import { StyleSheet, Text } from "react-native";


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
