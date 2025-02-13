import { Animated, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { themeColors } from "@/utils/theme-provider";


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
		width: 130,
		aspectRatio: 1,
		borderRadius: 99,
		marginBottom: 3,
	},
	bottomButton: {
		position: "absolute",
		bottom: 50,
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
	paddingTopButtons: {
		padding: 20,
	},
});

