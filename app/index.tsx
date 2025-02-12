import MaskedView from "@react-native-masked-view/masked-view";
import { ButtonGradient } from "@/components/button-gradient";
import { Pressable } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "@/utils/theme-provider";


export default function Index() {
	const theme = useTheme();
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "#0427d3",
			}}
		>
			<MaskedView
				style={{ flexDirection: "row", height: 85 }}
				maskElement={
					<Text
						style={{
							fontSize: 60,
							color: "black",
							fontWeight: "900",
							alignSelf: "center",
							shadowOffset: { width: 0, height: 6 },
							shadowOpacity: 0.2,
							shadowRadius: 0.3,
						}}
					>
						Basic ky
					</Text>
				}
			>
				<LinearGradient
					colors={["#fff", "#7cbcff"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
					style={{ flex: 1 }}
				/>
			</MaskedView>

			<Pressable style={styles.bottomButton}>
				<Text>Continuer</Text>
			</Pressable>
			<Pressable style={[styles.topButtons, styles.topLeftButton]}>
				<Text>+</Text>
			</Pressable>
			<ButtonGradient style={[styles.topButtons, styles.topRightButton]}>+</ButtonGradient>
			<Pressable style={[styles.topButtons, styles.topMiddleButton]}>
				<Text>+</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	topButtons: {
		position: "absolute",
		top: 25,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: 45,
		aspectRatio: 1,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "red",
	},
	topLeftButton: {
		left: 25,
	},
	topRightButton: {
		right: 25,
	},
	topMiddleButton: {
		left: "50%",
		transform: [{ translateX: "-50%" }],
	},
	bottomButton: {
		position: "absolute",
		bottom: 50,
		left: "50%",
		transform: [{ translateX: "-50%" }],
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
});
