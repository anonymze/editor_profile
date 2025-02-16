import Animated, { Easing, FadeInDown, FadeInLeft, FadeInRight, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming, } from "react-native-reanimated";
import { getStorageColor, getStorageImageUri, getStorageName, themeColors } from "@/utils/theme-storage";
import { ButtonRadialGradient, CircleRadialGradient } from "@/components/radial-gradient";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BottomSheetSelect, FoodItem } from "@/components/bottom-sheet-select";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { PencilIcon, UserRoundPenIcon } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import vegetables from "@/data/vegetables";
import { router } from "expo-router";
import fruits from "@/data/fruits";
import { Image } from "expo-image";


const initialSections = [
	{
		title: "Fruits",
		data: fruits,
	},
	{
		title: "Légumes",
		data: vegetables,
	},
];


export default function Page() {
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const [selectedValues, setSelectedValues] = useState<FoodItem[]>([]);
	const latestBatchRef = useRef<FoodItem[]>([]);

	const getSelectecValues = (values: FoodItem[]) => {
		latestBatchRef.current = values;
		setSelectedValues((prev) => [...new Set([...prev, ...values])]);
	};
	
	const themeColor = getStorageColor();
	const [canSearch, setCanSearch] = useState(false);
	const [showIngredients, setShowIngredients] = useState(false);
	const scale1 = useSharedValue(0.9);
	const scale2 = useSharedValue(0.7);
	const opacity = useSharedValue(0.4);

	const pulseStyle1 = useAnimatedStyle(() => ({
		transform: [{ scale: scale1.value }],
		opacity: opacity.value,
	}));

	const pulseStyle2 = useAnimatedStyle(() => ({
		transform: [{ scale: scale2.value }],
		opacity: opacity.value,
	}));

	useEffect(() => {
		scale1.value = withRepeat(
			withTiming(1.7, {
				duration: 5000,
				easing: Easing.linear,
			}),
			-1,
			false
		);

		scale2.value = withRepeat(
			withTiming(1.3, {
				duration: 5000,
				easing: Easing.linear,
			}),
			-1,
			false
		);

		opacity.value = withRepeat(
			withTiming(0, {
				duration: 5000,
				easing: Easing.linear,
			}),
			-1,
			false
		);
	}, []);

	const enteringAnimation = useCallback(
		() =>
			FadeInDown.duration(600)
				.delay(300)
				.easing(Easing.inOut(Easing.ease))
				.springify()
				.damping(16)
				.withInitialValues({
					opacity: 0,
					transform: [{ translateY: 100 }],
				}),
		[]
	);
	const enteringAnimationLeft = useCallback(
		() =>
			FadeInLeft.delay(150)
				.easing(Easing.in(Easing.ease))
				.springify()
				.damping(17)
				.stiffness(160)
				.withInitialValues({
					opacity: 0,
					transform: [{ translateX: -100 }],
				}),
		[]
	);

	const enteringAnimationRight = useCallback(
		() =>
			FadeInRight.delay(150)
				.easing(Easing.in(Easing.ease))
				.springify()
				.damping(17)
				.stiffness(160)
				.withInitialValues({
					opacity: 0,
					transform: [{ translateX: 100 }],
				}),
		[]
	);

	return (
		<BottomSheetModalProvider>
			<LayoutBackground color={themeColor} centeredContent={false}>
				<Animated.View
					style={StyleSheet.flatten([
						stylesLayout.topButtons,
						stylesLayout.topRightButton,
						{
							backgroundColor: themeColors[themeColor].secondary,
						},
					])}
					entering={FadeInDown.duration(800).delay(200).springify()}
				>
					<Pressable style={stylesLayout.paddingTopButtons} onPress={() => router.push("/profile")}>
						<UserRoundPenIcon size={24} color="#fff" />
					</Pressable>
				</Animated.View>

				<View style={styles.highPaddingTop}>
					<Animated.View entering={enteringAnimationLeft()}>
						<TextGradient color={themeColor} text={"FRIGO"} home style={{ fontSize: 75 }} />
					</Animated.View>
					<Animated.View entering={enteringAnimationRight()}>
						<TextGradient color={themeColor} text={"CHEF !"} home style={{ fontSize: 75, marginTop: -15 }} />
					</Animated.View>

					<Animated.View
						style={StyleSheet.flatten([stylesLayout.centerContent, styles.lowPaddingTop])}
						entering={FadeInDown.duration(800).delay(400).springify()}
					>
						<Pressable style={[stylesLayout.shadowImage, styles.imageContainer]} onPress={() => {
							bottomSheetRef.current?.present();
							console.log("present");
						}}>
							<Animated.View style={[styles.halo, pulseStyle1]} />
							<Animated.View style={[styles.halo, pulseStyle2]} />
							<Image style={stylesLayout.image} source={getStorageImageUri()} />
						</Pressable>
					</Animated.View>
				</View>

				{showIngredients ? (
					<Animated.View entering={enteringAnimationLeft()} style={styles.mediumPaddingTop}>
						<TextGradient
							lowShadow
							color={themeColor}
							text={"Vos ingrédients :"}
							style={styles.ingredientsText}
						/>
					</Animated.View>
				) : null}

				{canSearch && (
					<Animated.View
						style={StyleSheet.flatten([stylesLayout.bottomButton, { alignSelf: "center" }])}
						entering={enteringAnimation()}
					>
						<ButtonRadialGradient
							onPress={() => router.push("/recipe")}
							text="Trouver ma recette"
							color={themeColors[themeColor].primaryLight}
						/>
					</Animated.View>
				)}

				<BottomSheetSelect
					onSelect={getSelectecValues}
					titleModal="Ouvrir le frigo"
					data={initialSections}
					placeholderSearch="Chercher un aliment"
					ref={bottomSheetRef}
				/>
			</LayoutBackground>
		</BottomSheetModalProvider>
	);
}

const styles = StyleSheet.create({
	ingredientsText: {
		fontSize: 32,
		alignSelf: "flex-start",
		paddingLeft: 20,
	},
	mediumPaddingTop: {
		paddingTop: 45,
	},
	highPaddingTop: {
		paddingTop: 85,
	},
	lowPaddingTop: {
		paddingTop: 10,
	},
	imageContainer: {
		position: "relative",
	},
	halo: {
		position: "absolute",
		width: 140,
		aspectRatio: 1,
		borderRadius: 99,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.7)",
	},
});
