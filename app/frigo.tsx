import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { Pressable } from "react-native-gesture-handler";
import LayoutBackground from "@/layout/background";
import { Text } from "react-native";


export default function Page() {
	return (
		<LayoutBackground centeredContent color="green">
			<Pressable
				onPress={() => console.log('Button pressed')}
				style={({ pressed }) => ({
					opacity: pressed ? 0.8 : 1,
					transform: [{ scale: pressed ? 0.98 : 1 }],
				})}
			>
				<Svg width="300" height="300" >
					<Defs>
						<RadialGradient
							id="grad"
							cx="50%"
							cy="50%"
							rx="50%"
							ry="50%"
							fx="50%"
							fy="0"
							// gradientUnits="userSpaceOnUse"
							gradientUnits="objectBoundingBox"
						>
							<Stop offset="0%" stopColor="#fff" stopOpacity="1" />
							<Stop offset="100%" stopColor="#00ff00" stopOpacity="1" />
						</RadialGradient>
					</Defs>
					<Rect x="0" y="0" width="300" height="50" fill="url(#grad)" rx="20" ry="20" />
				</Svg>
				<Text style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: [{ translateX: -40 }],
					color: 'white',
					fontSize: 18,
					fontWeight: 'bold',
				}}>
					Click Me
				</Text>
			</Pressable>
		</LayoutBackground>
	);
}
