import Svg, { Defs, RadialGradient, Stop, Rect, Circle } from "react-native-svg";
import { Pressable, PressableProps } from "react-native-gesture-handler";
import { StyleSheet, Text } from "react-native";


export function ButtonRadialGradient({ text, color, ...props }: PressableProps & { text: string, color: string }) {
	return (
		<Pressable {...props} style={styles.containerButton}>
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
						<Stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
						<Stop offset="60%" stopColor={color} stopOpacity="0.8" />
					</RadialGradient>
				</Defs>
				<Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
			</Svg>
			<Text style={styles.text}>{text}</Text>
		</Pressable>
	);
}

export function CircleRadialGradient({ text, color, ...props }: PressableProps & { text: string, color: string }) {
	return (
		<Pressable {...props} style={styles.containerCircle}>
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
						<Stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
						<Stop offset="60%" stopColor={color} stopOpacity="0.8" />
					</RadialGradient>
				</Defs>
				<Circle cx="50%" cy="50%" r="50%" fill="url(#grad)" />
			</Svg>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	containerButton: {
		width: 325,
		height: 55,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "#fff",
		borderRadius: 99,
		overflow: "hidden",
	},
	containerCircle: {
		width: 100,
		height: 100,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "#fff",
		borderRadius: 99,
		overflow: "hidden",
	},
	text: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});