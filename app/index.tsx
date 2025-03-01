import Animated, { Easing, FadeIn, FadeInDown, FadeInLeft, FadeInRight, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming, runOnJS, } from "react-native-reanimated";
import { getStorageColor, getStorageLimitedAction, storage, themeColors } from "@/theme/theme-storage";
import { Alert, Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BottomSheetSelect, FoodItem } from "@/components/bottom-sheet-select";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { ButtonRadialGradient } from "@/components/radial-gradient";
import { BadgeInfoIcon, UserRoundIcon } from "lucide-react-native";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import * as Application from "expo-application";
import vegetables from "@/data/vegetables";
import ingredient from "@/data/ingredient";
import { router } from "expo-router";
import cheese from "@/data/cheese";
import { Image } from "expo-image";
import fruits from "@/data/fruit";
import pasta from "@/data/pasta";
import dough from "@/data/dough";
import dairy from "@/data/dairy";
import rice from "@/data/rice";
import meat from "@/data/meat";
import fish from "@/data/fish";


const { width, height } = Dimensions.get("window");

const initialSections = [
	{
		title: "Fromages",
		data: cheese,
	},
	{
		title: "Fruits",
		data: fruits,
	},
	{
		title: "Ingrédients",
		data: ingredient,
	},
	{
		title: "Légumes",
		data: vegetables,
	},
	{
		title: "Pâtes",
		data: pasta,
	},
	{
		title: "Pâtes préparées",
		data: dough,
	},
	{
		title: "Produits laitiers",
		data: dairy,
	},
	{
		title: "Poissons",
		data: fish,
	},
	{
		title: "Riz",
		data: rice,
	},
	{
		title: "Viandes",
		data: meat,
	},
];

export default function Page() {
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const [selectedValues, setSelectedValues] = useState<FoodItem[]>([]);
	const [showTooltip, setShowTooltip] = useState(false);
	const [isTooltipAnimating, setIsTooltipAnimating] = useState(false);
	const latestBatchRef = useRef<FoodItem[]>([]);
	const themeColor = getStorageColor();
	const {
		enteringAnimationLeft,
		// enteringAnimationRight,
		enteringAnimation,
		scale1,
		scale2,
		opacity,
		pulseStyle1,
		pulseStyle2,
		bounceStyle,
		translateY,
		opacityTooltip,
		widthTooltip,
		heightTooltip,
		animateTooltip,
		hideTooltip,
		buttonsOpacity,
	} = useAnimations(setIsTooltipAnimating);

	const getSelectecValues = (values: FoodItem[] | null) => {
		if (values === null) {
			latestBatchRef.current = [];
			setSelectedValues([]);
			return;
		}

		// Check if adding new values would exceed max of 8
		const uniqueNewValues = [...new Set([...selectedValues, ...values])];

		if (uniqueNewValues.length > 10) {
			Alert.alert("Attention", "Vous ne pouvez pas ajouter plus de 10 ingrédients", [{ text: "OK" }]);
			return;
		}

		latestBatchRef.current = values;
		setSelectedValues(uniqueNewValues);
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

		translateY.value = withDelay(
			600,
			withRepeat(
				withTiming(8, {
					duration: 1200,
					easing: Easing.inOut(Easing.ease),
				}),
				-1,
				true
			)
		);
	}, []);

	return (
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
					<UserRoundIcon size={24} color="#fff" />
				</Pressable>
			</Animated.View>

			<Animated.View
				style={StyleSheet.flatten([
					styles.tooltip,
					{
						backgroundColor: themeColors[themeColor].secondaryRgba(0.96),
						width: widthTooltip,
						height: heightTooltip,
						opacity: opacityTooltip,
					},
				])}
			>
				<View style={styles.tooltipViewAbsolute}>
					<Text style={styles.tooltipTextTitle}>Bienvenue sur {Application.applicationName}.</Text>
					<Text style={styles.tooltipText}>
						En appuyant sur le <Text style={styles.tooltipUnderlineText}>frigo</Text> vous pouvez ajoutez des
						ingrédients.
					</Text>

					<Text style={styles.tooltipText}>
						Un <Text style={styles.tooltipUnderlineText}>minimum de 3 ingrédients</Text> est requis pour
						trouver une recette.
					</Text>

					<Text style={styles.tooltipText}>
						En version gratuite, vous êtes limité sur vos recettes. Il vous en reste :
					</Text>
					<TextGradient
						color={themeColor}
						text={getStorageLimitedAction()}
						home
						style={{ fontSize: 60, marginTop: -13 }}
					/>
				</View>

				<Animated.View style={[styles.tooltipActionsAbsolute, { opacity: buttonsOpacity }]}>
					<ButtonRadialGradient text="Je m'abonne" color={themeColors[themeColor].primaryLight} isAction />
					<ButtonRadialGradient
						text="Compris !"
						color={themeColors[themeColor].primaryLight}
						isAction
						onPress={() => {
							setShowTooltip(false);
							hideTooltip();
						}}
					/>
				</Animated.View>
			</Animated.View>

			<Animated.View entering={FadeInDown.duration(800).delay(200).springify()}>
				<Animated.View
					style={StyleSheet.flatten([
						stylesLayout.topButtons,
						stylesLayout.topLeftButton,
						{
							backgroundColor: themeColors[themeColor].secondary,
							borderRadius: 99,
							opacity: isTooltipAnimating ? 0.7 : 1,
						},
					])}
				>
					<Pressable
						style={stylesLayout.paddingTopButtons}
						onPress={() => {
							if (!isTooltipAnimating) {
								if (showTooltip) {
									hideTooltip();
								} else {
									animateTooltip();
								}
								setShowTooltip(!showTooltip);
							}
						}}
					>
						<BadgeInfoIcon size={26} color="#fff" />
					</Pressable>
				</Animated.View>
			</Animated.View>

			<View style={styles.highPaddingTop}>
				<Animated.View entering={enteringAnimationLeft()}>
					<TextGradient
						color={themeColor}
						text={`${Application.applicationName?.toUpperCase()} !`}
						style={{ fontSize: height < 630 || width < 400 ? 60 : 75 }}
					/>
				</Animated.View>
				{/* <Animated.View entering={enteringAnimationRight()}>
						<TextGradient color={themeColor} text={"CHEF !"} home style={{ fontSize: 75, marginTop: -15 }} />
					</Animated.View> */}

				<Animated.View
					style={stylesLayout.centerContent}
					entering={FadeInDown.duration(800).delay(400).springify()}
				>
					<Pressable
						onPress={() => {
							bottomSheetRef.current?.present();
						}}
					>
						<Animated.View style={StyleSheet.flatten([stylesLayout.centerContent, bounceStyle])}>
							<Animated.View style={[styles.halo, pulseStyle1]} />
							<Animated.View style={[styles.halo, pulseStyle2]} />
							<Image
								style={[stylesLayout.imageHome]}
								source={require("@/assets/images/fridge.png")}
								cachePolicy="memory-disk"
								contentFit="contain"
							/>
						</Animated.View>
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

					<View style={styles.containerIngredients}>
						{selectedValues.map((value) => (
							<Animated.View
								key={value.id}
								entering={FadeInDown.duration(300)
									.delay(latestBatchRef.current.indexOf(value) * 100)
									.springify()}
							>
								<Image
									transition={300}
									placeholder={require("@/assets/images/fridge.png")}
									source={value.image}
									style={styles.imageIngredients}
								/>
							</Animated.View>
						))}
					</View>
				</Fragment>
			) : null}

			{selectedValues.length >= 3 && (
				<Animated.View
					style={StyleSheet.flatten([stylesLayout.bottomButton, { alignSelf: "center" }])}
					entering={enteringAnimation()}
				>
					<ButtonRadialGradient
						onPress={async () => {
							router.push({
								pathname: "/recipe",
								params: {
									prompt: selectedValues.map((value) => value.label.FR).join(","),
									vendorId:
										Platform.OS === "ios"
											? await Application.getIosIdForVendorAsync()
											: Application.getAndroidId(),
								},
							});
						}}
						text="Trouver ma recette"
						color={themeColors[themeColor].primaryLight}
					/>
				</Animated.View>
			)}

			<BottomSheetSelect
				onSelect={getSelectecValues}
				data={initialSections}
				placeholderSearch="Chercher des ingrédients"
				ref={bottomSheetRef}
				themeColor={themeColor}
			/>
		</LayoutBackground>
	);
}

const useAnimations = (setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>) => {
	const scale1 = useSharedValue(0.7);
	const scale2 = useSharedValue(0.5);
	const opacity = useSharedValue(0.4);
	const translateY = useSharedValue(0);
	const opacityTooltip = useSharedValue(0);
	const widthTooltip = useSharedValue(0);
	const heightTooltip = useSharedValue(0);
	const buttonsOpacity = useSharedValue(0);

	const animateTooltip = () => {
		runOnJS(setIsAnimating)(true);

		opacityTooltip.value = withTiming(1, {
			duration: 280,
			easing: Easing.linear,
		});

		widthTooltip.value = withTiming(width - 40, {
			duration: 280,
			easing: Easing.elastic(1.1),
		});

		heightTooltip.value = withTiming(
			425,
			{
				duration: 280,
				easing: Easing.elastic(1.1),
			},
			() => {
				runOnJS(setIsAnimating)(false);
			}
		);

		buttonsOpacity.value = withTiming(1, {
			duration: 280,
			easing: Easing.linear,
		});
	};

	const hideTooltip = () => {
		runOnJS(setIsAnimating)(true);

		buttonsOpacity.value = withTiming(0, {
			duration: 100,
			easing: Easing.out(Easing.ease),
		});

		opacityTooltip.value = withDelay(
			150,
			withTiming(0, {
				duration: 50,
				easing: Easing.out(Easing.ease),
			})
		);

		const initialWidth = width - 40;
		const initialHeight = 425;

		widthTooltip.value = withTiming(
			initialWidth * 1.06,
			{
				duration: 110,
				easing: Easing.out(Easing.ease),
			},
			() => {
				widthTooltip.value = withTiming(0, {
					duration: 200,
					easing: Easing.out(Easing.ease),
				});
			}
		);

		heightTooltip.value = withTiming(
			initialHeight * 1.06,
			{
				duration: 110,
				easing: Easing.out(Easing.ease),
			},
			() => {
				heightTooltip.value = withTiming(
					0,
					{
						duration: 200,
						easing: Easing.out(Easing.ease),
					},
					() => {
						runOnJS(setIsAnimating)(false);
					}
				);
			}
		);
	};

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

	const bounceStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	return {
		enteringAnimationRight,
		enteringAnimationLeft,
		enteringAnimation,
		pulseStyle1,
		pulseStyle2,
		bounceStyle,
		scale1,
		scale2,
		opacity,
		translateY,
		opacityTooltip,
		widthTooltip,
		heightTooltip,
		buttonsOpacity,
		animateTooltip,
		hideTooltip,
	};
};

const styles = StyleSheet.create({
	ingredientsText: {
		fontSize: 32,
		alignSelf: "flex-start",
		paddingLeft: 20,
	},
	mediumPaddingTop: {
		paddingTop: height > 700 ? 60 : height > 630 ? 40 : 30,
	},
	highPaddingTop: {
		paddingTop: Platform.OS === "ios" ? 95 : 80,
	},
	halo: {
		position: "absolute",
		width: height > 700 ? 160 : height > 630 ? 130 : 115,
		aspectRatio: 1,
		borderRadius: 99,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.7)",
		top: 5,
	},
	containerIngredients: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		rowGap: 8,
		columnGap: 20,
		paddingLeft: 20,
		paddingTop: 18,
	},
	imageIngredients: {
		width: height > 660 ? 50 : 40,
		height: height > 660 ? 50 : 40,
	},
	tooltip: {
		position: "absolute",
		top: 90,
		left: 20,
		zIndex: 99,
		borderRadius: 20,
		padding: 26,
	},
	tooltipText: {
		color: "#fff",
		fontSize: 17,
		fontWeight: "600",
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 1,
		paddingBottom: 20,
	},
	tooltipTextTitle: {
		color: "#fff",
		fontSize: 22,
		fontWeight: "700",
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 1,
		paddingBottom: 24,
	},
	tooltipActionButton: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 10,
		borderRadius: 8,
	},
	tooltipUnderlineText: {
		fontWeight: "bold",
		textDecorationLine: "underline",
	},
	tooltipViewAbsolute: {
		position: "absolute",
		top: 20,
		left: 20,
		zIndex: 100,
		width: width - 80,
	},
	tooltipActionsAbsolute: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 20,
		position: "absolute",
		bottom: 20,
		left: 20,
		zIndex: 100,
		width: width - 80,
	},
});
