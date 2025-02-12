import Animated, { FadeInDown } from "react-native-reanimated";
import { InputTextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { XIcon, CheckIcon } from "lucide-react-native";
import LayoutBackground from "@/layout/background";
import { stylesLayout } from "@/layout/background";
import { TextInput, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useRef } from "react";


export default function Index() {
	const inputRef = useRef<TextInput>(null);

	return (
		<LayoutBackground
			centeredContent
			onLayout={() => {
				inputRef.current?.focus();
			}}
		>
			<View id="container" style={stylesLayout.container}>
				<Animated.View entering={FadeInDown.duration(800).delay(200).springify()}>
					<Image style={stylesLayout.image} source="https://picsum.photos/seed/696/3000/2000" />
				</Animated.View>
				<Animated.View entering={FadeInDown.duration(800).delay(150).springify()}>
					<InputTextGradient text={"Coucou"} style={{ fontSize: 60 }} ref={inputRef} maxLength={8} />
				</Animated.View>
			</View>
			<Animated.View
				style={[stylesLayout.topButtons, stylesLayout.topLeftButton]}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable
					style={stylesLayout.paddingTopButtons}
					onPress={() => {
						router.push("/");
					}}
				>
					<XIcon size={28} color="#fff" />
				</Pressable>
			</Animated.View>
			<Animated.View
				style={[stylesLayout.topButtons, stylesLayout.topRightButton]}
				entering={FadeInDown.duration(800).delay(200).springify()}
			>
				<Pressable style={stylesLayout.paddingTopButtons}>
					<CheckIcon size={28} color="#fff" />
				</Pressable>
			</Animated.View>
		</LayoutBackground>
	);
}
