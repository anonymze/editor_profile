import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { Pressable, PressableProps } from "react-native-gesture-handler";
import { StyleSheet, Text } from "react-native";


export function ButtonGradient({ text, color, ...props }: PressableProps & { text: string, color: string }) {
	return (
		<Pressable {...props} style={styles.container}>
			<Svg style={{ position: "absolute", width: "100%", height: "100%" }}>
				<Defs>
					<RadialGradient
						id="grad"
						cx="50%"
						cy="0%"
						rx="100%"
						ry="100%"
						fx="50%"
						fy="0%"
						// gradientUnits="userSpaceOnUse"
					>
						<Stop offset="20%" stopColor="#fff" stopOpacity="0.8" />
						<Stop offset="100%" stopColor={color} stopOpacity="0.9" />
					</RadialGradient>
				</Defs>
				<Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" rx="27.5" ry="27.5" />
			</Svg>
			<Text style={styles.text}>{text}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 325,
		height: 55,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});
