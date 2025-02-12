import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { InputTextGradient, TextGradient } from "@/components/text-gradient";
import { PlusIcon, PencilIcon } from "lucide-react-native";
import { Pressable } from "react-native-gesture-handler";
import LayoutBackground from "@/layout/background";
import { stylesLayout } from "@/layout/background";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";


export default function Index() {
	return (
		<LayoutBackground centeredContent>
			<View id="container" style={stylesLayout.container}>
				<Animated.View entering={FadeInDown.duration(800).delay(200).springify()}>
					<Image style={stylesLayout.image} source="https://picsum.photos/seed/696/3000/2000" />
				</Animated.View>
				<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
					<TextGradient text={"Coufefcou"} style={{ fontSize: 60 }} />
				</Animated.View>
			</View>

			<Animated.View
				style={[stylesLayout.topButtons, stylesLayout.topLeftButton]}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable style={stylesLayout.paddingTopButtons}>
					<PlusIcon size={28} color="#fff" />
				</Pressable>
			</Animated.View>
			<Animated.View
				style={[stylesLayout.topButtons, stylesLayout.topRightButton]}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable
					style={stylesLayout.paddingTopButtons}
					onPress={() => router.push("/edit")}
				>
					<PencilIcon size={22} color="#fff" />
				</Pressable>
			</Animated.View>

			<Animated.View style={stylesLayout.bottomButton} entering={FadeInDown.duration(500).delay(300)}>
				<Pressable>
					<Text>Continuer</Text>
				</Pressable>
			</Animated.View>
		</LayoutBackground>
	);
}
