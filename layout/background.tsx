import { Dimensions, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { themeColors } from "@/utils/theme-storage";
import { starPositions } from "@/utils/stars";
import { Circle } from "react-native-svg";
import { Svg } from "react-native-svg";


const { height} = Dimensions.get("window");

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
		top: 30,
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
	},
	imageHome: {
		width: height > 700 ? 160 : 130,
		aspectRatio: 1,
		marginTop: 15,
	},
	imageRecipe: {
		width: 70,
		aspectRatio: 1,
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
	containerWithGap: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
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
		shadowOpacity: 0,
	},
	smallHalo: {
		width: 240,
		zIndex: -9,
		opacity: 0.2,
	},
	bigHalo: {
		width: 350,
		zIndex: -10,
		opacity: 0.1,
	},
});
