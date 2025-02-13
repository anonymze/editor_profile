import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { themeColors } from "@/utils/theme-provider";
import { starPositions } from "@/utils/stars";
import { Fragment, useMemo } from "react";
import { Circle } from "react-native-svg";
import { Svg } from "react-native-svg";


// Create an animated version of LinearGradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function LayoutBackground(props: {
	centeredContent: boolean;
	children: React.ReactNode;
	color: keyof typeof themeColors;
	onLayout?: () => void;
	style?: StyleProp<ViewStyle>;
}) {
	return (
		<LinearGradient
			colors={[themeColors[props.color].primaryLight, themeColors[props.color].primaryDark]}
			style={[props.centeredContent ? styles.containerCentered : styles.container, props.style]}
			onLayout={props.onLayout}
		>
			<Svg
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					zIndex: -20,
				}}
			>
				{starPositions.map((star) => (
					<Circle key={star.id} cx={star.left} cy={star.top} r="1.5" fill="white" opacity={star.opacity} />
				))}
			</Svg>

			{props.children}
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	containerCentered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flex: 1,
	},
});

export const stylesLayout = StyleSheet.create({
	topButtons: {
		position: "absolute",
		top: 35,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: 45,
		aspectRatio: 1,
		borderRadius: 12,
		boxShadow: "inset 0 0 9px 0 #fff",
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
		width: 140,
		aspectRatio: 1,
		borderRadius: 99,
		marginBottom: 4,
	},
	bottomButton: {
		position: "absolute",
		bottom: 45,
		width: "100%",
		maxWidth: 300,
		alignItems: "center",
		borderRadius: 99,
	},
	bottomButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	centerContent: {
		justifyContent: "center",
		alignItems: "center",
	},
	paddingTopButtons: {
		padding: 20,
	},
	shadowImage: {
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: -1, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	gradientHalo: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		aspectRatio: 1,
		borderWidth: 0,
		borderRadius: 999,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		shadowOpacity: 0,
	},
});
