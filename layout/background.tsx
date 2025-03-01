import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet } from "react-native";
import { themeColors } from "@/theme/theme-storage";
import { starPositions } from "@/utils/stars";
import { Circle } from "react-native-svg";
import { Svg } from "react-native-svg";


const { height } = Dimensions.get("window");

export default function LayoutBackground(props: {
	centeredContent: boolean;
	children: React.ReactNode;
	color: keyof typeof themeColors;
}) {
	return (
		<LinearGradient
			colors={[themeColors[props.color].primaryLight, themeColors[props.color].primaryDark]}
			style={props.centeredContent ? styles.containerCentered : styles.container}
		>
			<Svg style={styles.containerSvg}>
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
	containerSvg: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 0,
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
		width: height > 700 ? 160 : height > 630 ? 130 : 115,
		aspectRatio: 1,
		top: 5,
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
		borderRadius: 99,
		// shadowColor: "#000",
		// shadowOffset: { width: -1, height: 1 },
		// shadowOpacity: 0.3,
		// shadowRadius: 2,
		boxShadow: "-1px 2px 9px 0 rgba(0,0,0,0.1)",
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
	flex: {
		flex: 1,
	},
});
