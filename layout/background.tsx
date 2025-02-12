import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";


export default function LayoutBackground(props: {
	centeredContent: boolean;
	onLayout: () => void;
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
}) {
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
