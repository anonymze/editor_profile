import Svg, { Defs, RadialGradient, Stop, Rect, Circle } from "react-native-svg";
import { Pressable, PressableProps } from "react-native-gesture-handler";
import { StyleSheet, Text } from "react-native";


export function ButtonRadialGradient({
	text,
	color,
	style,
	...props
}: PressableProps & { text: string; color: string }) {
	return (
		<Pressable {...props} style={StyleSheet.flatten([styles.containerButton, style])}>
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

export function CircleRadialGradient({
	icon,
	color,
	style,
	offset = "65%",
	...props
}: PressableProps & { icon: React.ReactNode | null; color: string; offset?: `${number}%` }) {
	return (
		<Pressable {...props} style={StyleSheet.flatten([styles.containerCircle, style])}>
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
						<Stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
						<Stop offset={offset} stopColor={color} stopOpacity="1" />
					</RadialGradient>
				</Defs>
				<Circle cx="50%" cy="50%" r="50%" fill="url(#grad)" />
			</Svg>
			{icon}
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
		width: 45,
		aspectRatio: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 99,
		borderWidth: 1,
		borderColor: "#fff",
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowOffset: {
			width: -1,
			height: 1,
		},
		shadowRadius: 2,
	},
	text: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});
