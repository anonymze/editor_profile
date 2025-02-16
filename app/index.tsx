import Animated, { Easing, FadeIn, FadeInDown, FadeInLeft, FadeInRight, useAnimatedStyle, useSharedValue, withRepeat, withTiming, } from "react-native-reanimated";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BottomSheetSelect, FoodItem } from "@/components/bottom-sheet-select";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { getStorageColor, themeColors } from "@/utils/theme-storage";
import { ButtonRadialGradient } from "@/components/radial-gradient";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import { UserRoundPenIcon } from "lucide-react-native";
import fridgeImage from "@/assets/images/fridge.png";
import { StyleSheet, View } from "react-native";
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
	const themeColor = getStorageColor();
	const {
		enteringAnimationLeft,
		enteringAnimationRight,
		enteringAnimation,
		scale1,
		scale2,
		opacity,
		pulseStyle1,
		pulseStyle2,
	} = useAnimations();

	const getSelectecValues = (values: FoodItem[] | null) => {
		if (values === null) {
			latestBatchRef.current = [];
			setSelectedValues([]);
			return;
		}
		latestBatchRef.current = values;
		setSelectedValues((prev) => [...new Set([...prev, ...values])]);
	};

	useEffect(() => {
		scale1.value = withRepeat(
			withTiming(1.5, {
				duration: 5000,
				easing: Easing.linear,
			}),
			-1,
			false
		);

		scale2.value = withRepeat(
			withTiming(1.1, {
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
						<Pressable
							style={[stylesLayout.shadowImage, styles.imageContainer]}
							onPress={() => {
								bottomSheetRef.current?.present();
							}}
						>
							<Animated.View style={[styles.halo, pulseStyle1]} />
							<Animated.View style={[styles.halo, pulseStyle2]} />
							<Image
								style={stylesLayout.imageHome}
								source={fridgeImage}
								cachePolicy="memory-disk"
								contentFit="contain"
							/>
						</Pressable>
					</Animated.View>
				</View>

				{selectedValues.length > 0 ? (
					<Fragment>
						<Animated.View entering={FadeIn} style={styles.mediumPaddingTop}>
							<TextGradient
								lowShadow
								color={themeColor}
								text={"Vos ingrédients :"}
								style={styles.ingredientsText}
							/>
						</Animated.View>

						<View style={styles.containerFruits}>
							{selectedValues.map((value) => (
								<Animated.View
									key={value.id}
									entering={FadeInDown.duration(300)
										.delay(latestBatchRef.current.indexOf(value) * 100)
										.springify()}
								>
									<Image source={value.image} style={{ width: 50, height: 50 }} />
								</Animated.View>
							))}
						</View>
					</Fragment>
				) : null}

				{selectedValues.length > 2 && (
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
					data={initialSections}
					placeholderSearch="Chercher un ingrédient"
					ref={bottomSheetRef}
				/>
			</LayoutBackground>
		</BottomSheetModalProvider>
	);
}

const useAnimations = () => {
	const scale1 = useSharedValue(0.7);
	const scale2 = useSharedValue(0.5);
	const opacity = useSharedValue(0.4);

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

	const pulseStyle1 = useAnimatedStyle(() => ({
		transform: [{ scale: scale1.value }],
		opacity: opacity.value,
	}));

	const pulseStyle2 = useAnimatedStyle(() => ({
		transform: [{ scale: scale2.value }],
		opacity: opacity.value,
	}));

	return {
		enteringAnimationRight,
		enteringAnimationLeft,
		enteringAnimation,
		pulseStyle1,
		pulseStyle2,
		scale1,
		scale2,
		opacity,
	};
};

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
	containerFruits: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		rowGap: 8,
		columnGap: 20,
		paddingLeft: 15,
		paddingTop: 10,
	},
});
