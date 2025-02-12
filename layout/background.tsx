import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import useTheme from "@/utils/theme-provider";


export default function LayoutBackground(props: {
	centeredContent: boolean;
	children: React.ReactNode;
	onLayout?: () => void;
	style?: StyleProp<ViewStyle>;
}) {
	const theme = useTheme();
	return (
		<LinearGradient
			colors={["#000dfa", "#040ac1"]}
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
