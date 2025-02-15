import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming, } from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Stop, Rect, Circle } from "react-native-svg";
import { Pressable, PressableProps } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";


export function ButtonRadialGradient({
	text,
	color,
	style,
	...props
}: PressableProps & { text: string; color: string }) {
	return (
		<Pressable {...props} style={StyleSheet.flatten([styles.containerButton, style])}>
			<Svg style={styles.absoluteFull}>
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
				<Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" rx={27.5} ry={27.5} />
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
			<Svg style={styles.absoluteFull}>
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
						<Stop offset={offset} stopColor={color} stopOpacity="0.9" />
					</RadialGradient>
				</Defs>
				<Circle cx="50%" cy="50%" r="50%" fill="url(#grad)" />
			</Svg>
			{icon}
		</Pressable>
	);
}

export function AnimatedCircleRadialGradient({
	icon,
	color,
	style,
	offset = "65%",
	...props
}: PressableProps & { icon: React.ReactNode | null; color: string; offset?: `${number}%` }) {
	const scale = useSharedValue(0.4);
	const opacity = useSharedValue(1);

	const rStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
			opacity: opacity.value,
		};
	});

	useEffect(() => {
		scale.value = withRepeat(
			withSequence(
				withTiming(1, {
					duration: 3500,
					easing: Easing.linear,
				})
			),
			-1,
			false
		);

		opacity.value = withRepeat(
			withDelay(
				3200,
				withTiming(0, {
					duration: 300,
					easing: Easing.linear,
				})
			),

			-1,
			false
		);
	}, []);

	return (
		<Pressable {...props} style={StyleSheet.flatten([styles.containerCircle, style])}>
				<Svg style={StyleSheet.flatten([styles.absoluteFull])}>
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
							<Stop offset={offset} stopColor={color} stopOpacity="0.9" />
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
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	absoluteFull: {
		position: "absolute",
		width: "100%",
		height: "100%",
	},
});
