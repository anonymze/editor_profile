import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useTheme, themeColors } from "@/utils/theme-provider";
import { LinearGradient } from "react-native-linear-gradient";


export default function LayoutBackground(props: {
	centeredContent: boolean;
	children: React.ReactNode;
	onLayout?: () => void;
	style?: StyleProp<ViewStyle>;
}) {
	const theme = useTheme();
	return (
		<LinearGradient
			colors={[themeColors[theme.color].primaryLight, themeColors[theme.color].primaryDark]}
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

export const stylesLayoutDynamic = (backgroundColor: string) => {
	return StyleSheet.create({
		topButtons: {
			position: "absolute",
			top: 35,
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			width: 45,
			aspectRatio: 1,
			borderRadius: 12,
			backgroundColor,
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
			borderRadius: 99,
			padding: 16,
			backgroundColor: "red",
			borderTopColor: "#fff",
			borderTopWidth: 2,
			color: "#fff",
			alignItems: "center",
		},
		container: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		paddingTopButtons: {
			padding: 25,
		},
	});
}

