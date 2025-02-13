import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { Pressable } from "react-native-gesture-handler";
import LayoutBackground from "@/layout/background";
import { Text } from "react-native";


export default function Page() {
	return (
		<LayoutBackground centeredContent color="green">
			<Pressable
				onPress={() => console.log("Button pressed")}
				style={{
					width: 325,
					height: 55,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Svg style={{ position: "absolute", width: "100%", height: "100%" }}>
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
							<Stop offset="20%" stopColor="#fff" stopOpacity="0.8" />
							<Stop offset="100%" stopColor="#00ff00" stopOpacity="0.9" />
						</RadialGradient>
					</Defs>
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" rx="27.5" ry="27.5" />
				</Svg>
				<Text
					style={{
						color: "#fff",
						fontSize: 18,
						fontWeight: "bold",
					}}
				>
					Continuer
				</Text>
			</Pressable>
		</LayoutBackground>
	);
}
