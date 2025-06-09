import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming, } from "react-native-reanimated";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect, Circle } from "react-native-svg";
import { Pressable, PressableProps } from "react-native-gesture-handler";
import { useEffect } from "react";


const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export function ButtonRadialGradient({
	text,
	color,
	style,
	isAction = false,
	noSvg = false,
	...props
}: TouchableOpacityProps & { text: string; color: string; isAction?: boolean; noSvg?: boolean }) {
	return (
		<TouchableOpacity
			{...props}
			style={StyleSheet.flatten([
				styles.containerButton,
				style,
				isAction
					? {
							flex: 1,
							borderRadius: 12,
							height: 45,
					  }
					: undefined,
			])}
		>
			{!noSvg && (
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
					<Rect
						x="0"
						y="0"
						width="100%"
						height="100%"
						fill="url(#grad)"
						rx={isAction ? 12 : 27.5}
						ry={isAction ? 12 : 27.5}
					/>
				</Svg>
			)}
			<Text
				style={StyleSheet.flatten([
					styles.text,
					{
						fontSize: isAction ? 14 : 18,
					},
				])}
			>
				{text}
			</Text>
		</TouchableOpacity>
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
		scale.value = withDelay(
			5000,
			withRepeat(
				withSequence(
					withTiming(1, {
						duration: 3500,
						easing: Easing.linear,
					})
				),
				-1,
				false
			)
		);

		opacity.value = withDelay(
			5000,
			withRepeat(
				withDelay(
					3200,
					withTiming(0, {
						duration: 300,
						easing: Easing.linear,
					})
				),

				-1,
				false
			)
		);
	}, []);

	return (
		<Pressable {...props} style={StyleSheet.flatten([styles.containerCircle, style])}>
			<AnimatedSvg style={StyleSheet.flatten([styles.absoluteFull, rStyle])}>
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
			</AnimatedSvg>
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
