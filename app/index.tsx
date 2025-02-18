import Animated, { Easing, FadeIn, FadeInDown, FadeInLeft, FadeInRight, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming, } from "react-native-reanimated";
import { getStorageColor, getStorageLimitedAction, themeColors } from "@/utils/theme-storage";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BottomSheetSelect, FoodItem } from "@/components/bottom-sheet-select";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { ButtonRadialGradient } from "@/components/radial-gradient";
import { BadgeInfoIcon, UserRoundIcon } from "lucide-react-native";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { TextGradient } from "@/components/text-gradient";
import { Pressable } from "react-native-gesture-handler";
import vegetables from "@/data/vegetables";
import { router } from "expo-router";
import fruits from "@/data/fruits";
import { Image } from "expo-image";


const width = Dimensions.get("window").width;

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
	const [showTooltip, setShowTooltip] = useState(false);
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
		bounceStyle,
		translateY,
		opacityTooltip,
		widthTooltip,
		heightTooltip,
		animateTooltip,
		hideTooltip,
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
					<View
						style={[
							{
								position: "absolute",
								top: 20,
								left: 20,
								zIndex: 100,
								width: width - 80,
							},
						]}
					>
						<Text style={styles.tooltipTextTitle}>Bienvenue sur Fridgy.</Text>
						<Text style={styles.tooltipText}>
							En appuyant sur le{" "}
							<Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>frigo</Text> vous pouvez
							ajoutez des ingrédients.
						</Text>

						<Text style={styles.tooltipText}>
							Un{" "}
							<Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>
								minimum de 3 ingrédients
							</Text>{" "}
							est requis pour trouver une recette.
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

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							gap: 20,
							position: "absolute",
							bottom: 20,
							left: 20,
							zIndex: 100,
							width: width - 80,
						}}
					>
						<Pressable
							style={[
								styles.tooltipActionButton,
								{
									borderRadius: 5,
									backgroundColor: themeColors[themeColor].primary,
									shadowColor: "#fff",
									shadowOffset: { width: -4, height: 4 },
									shadowOpacity: 0.9,
									shadowRadius: 0,
								},
							]}
						>
							<Text
								style={{
									color: "#fff",
									fontSize: 16,
									fontWeight: "bold",
								}}
							>
								Je m'abonne
							</Text>
						</Pressable>
						<Pressable
							style={(state) => {
								return [
									styles.tooltipActionButton,
									{
										backgroundColor: themeColors[themeColor].primary,
										shadowColor: "#fff",
										shadowOffset: { width: -4, height: 4 },
										shadowOpacity: 0.9,
										shadowRadius: 0,
										borderRadius: 5,
									},
								];
							}}
							onPress={() => {
								setShowTooltip(false);
								hideTooltip();
							}}
						>
							<Text
								style={{
									color: "#fff",
									fontSize: 16,
									fontWeight: "bold",
								}}
							>
								Compris !
							</Text>
						</Pressable>
					</View>
				</Animated.View>

				<Animated.View
					style={StyleSheet.flatten([
						stylesLayout.topButtons,
						stylesLayout.topLeftButton,
						{
							backgroundColor: themeColors[themeColor].secondary,
							borderRadius: 99,
						},
					])}
					entering={FadeInDown.duration(800).delay(200).springify()}
				>
					<Pressable
						style={stylesLayout.paddingTopButtons}
						onPress={() => {
							if (showTooltip) {
								hideTooltip();
							} else {
								animateTooltip();
							}
							setShowTooltip(!showTooltip);
						}}
					>
						<BadgeInfoIcon size={26} color="#fff" />
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
							style={stylesLayout.shadowImage}
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

				{selectedValues.length >= -1 && (
					<Animated.View
						style={StyleSheet.flatten([stylesLayout.bottomButton, { alignSelf: "center" }])}
						entering={enteringAnimation()}
					>
						<ButtonRadialGradient
							onPress={() => {
								if (getStorageLimitedAction() <= 0) {
									if (!showTooltip) animateTooltip();
									setShowTooltip(true);
									return;
								}

								router.push({
									pathname: "/recipe",
									params: {
										// prompt: selectedValues.map((value) => value.label.FR).join(','),
										prompt: ["ail", "carotte", "poivron"],
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
					placeholderSearch="Chercher un ingrédient"
					ref={bottomSheetRef}
					themeColor={themeColor}
				/>
			</LayoutBackground>
		</BottomSheetModalProvider>
	);
}

const useAnimations = () => {
	const scale1 = useSharedValue(0.7);
	const scale2 = useSharedValue(0.5);
	const opacity = useSharedValue(0.4);
	const translateY = useSharedValue(0);
	const opacityTooltip = useSharedValue(0);
	const widthTooltip = useSharedValue(30);
	const heightTooltip = useSharedValue(30);

	const animateTooltip = () => {
		opacityTooltip.value = withTiming(1, {
			duration: 280,
			easing: Easing.linear,
		});

		widthTooltip.value = withTiming(width - 40, {
			duration: 280,
			easing: Easing.elastic(),
		});

		heightTooltip.value = withTiming(400, {
			duration: 280,
			easing: Easing.elastic(),
		});
	};

	const hideTooltip = () => {
		opacityTooltip.value = withTiming(0, {
			duration: 0,
			easing: Easing.linear,
		});

		widthTooltip.value = withTiming(30, {
			duration: 0,
			easing: Easing.linear,
		});

		heightTooltip.value = withTiming(30, {
			duration: 0,
			easing: Easing.linear,
		});
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
		paddingTop: 45,
	},
	highPaddingTop: {
		paddingTop: 85,
	},
	lowPaddingTop: {
		paddingTop: 10,
	},
	halo: {
		position: "absolute",
		width: 140,
		left: 9,
		top: 10,
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
		paddingLeft: 20,
		paddingTop: 10,
	},
	tooltip: {
		position: "absolute",
		top: 98,
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
});
