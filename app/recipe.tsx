import { getStorageColor, getStorageLimitedAction, getStorageName, setStorageLimitedAction, themeColors, } from "@/theme/theme-storage";
import { ArrowLeftIcon, BookAIcon, CarrotIcon, ChefHatIcon, ClockIcon, DotIcon, MinusIcon, UsersRoundIcon, } from "lucide-react-native";
import { Gesture, GestureDetector, Pressable, ScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeInDown, FadeOut, runOnJS } from "react-native-reanimated";
import SplashScreenAnimation from "@/components/splashscreen-animation";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import * as Application from "expo-application";
import type { Recipe } from "@/types/recipe";
import React from "react";


export default function Page() {
	const themeColor = getStorageColor();
	const [splashScreen, setSplashScreen] = useState(true);
	const [response, setResponse] = useState<Recipe | null>(null);
	const { prompt, vendorId } = useLocalSearchParams();

	useEffect(() => {
		const abortController = new AbortController();
		const fetchRecipe = async () => {
			try {
				const response = await fetch(
					`${
						process.env.NODE_ENV === "development" ? "http://localhost:8081" : process.env.EXPO_PUBLIC_API_URL
					}${process.env.EXPO_PUBLIC_API_URL_RECIPE_URL}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
							"X-Origin": Application.applicationName ?? "",
							"X-Vendor-Id": vendorId?.toString() ?? "",
						},
						body: JSON.stringify({
							username: getStorageName(),
							prompt: prompt.toString(),
						}),
						signal: abortController.signal,
					}
				);

				setResponse(await response.json());
				setSplashScreen(false);
				setStorageLimitedAction(getStorageLimitedAction() - 1);
			} catch (error) {
				console.log(error);
				if (error instanceof Error && error.name === "AbortError") return;

				Alert.alert("Erreur", "Un problème est survenu lors de la génération de la recette.", [
					{ text: "OK" },
				]);
				router.back();
			}
		};

		fetchRecipe();

		return () => {
			abortController.abort();
		};
	}, []);

	const panGesture = useMemo(
		() =>
			Gesture.Pan()
				.activeOffsetX([-20, 20])
				.onEnd((event) => {
					if (event.translationX > 50) {
						runOnJS(router.back)();
					}
				}),
		[]
	);

	return (
		<GestureDetector gesture={panGesture}>
			{Platform.OS === "android" ? (
				<View collapsable={false} style={stylesLayout.flex}>
					<LayoutBackground color={themeColor} centeredContent={false}>
						<Animated.View
							style={StyleSheet.flatten([
								stylesLayout.topButtons,
								stylesLayout.topRightButton,
								{
									backgroundColor: themeColors[themeColor].secondary,
									zIndex: 1000,
								},
							])}
							entering={FadeInDown.duration(800).delay(200).springify()}
						>
							<Pressable
								onPress={() => {
									router.back();
								}}
								style={stylesLayout.paddingTopButtons}
							>
								<ArrowLeftIcon size={26} color="#fff" />
							</Pressable>
						</Animated.View>
						{splashScreen ? (
							<Animated.View style={stylesLayout.container} exiting={FadeOut.duration(400)}>
								<SplashScreenAnimation />
							</Animated.View>
						) : (
							<Animated.ScrollView style={stylesLayout.flex} entering={FadeIn}>
								{response && <RecipeContent themeColor={themeColor} recipe={response} />}
							</Animated.ScrollView>
						)}
					</LayoutBackground>
				</View>
			) : (
				<LayoutBackground color={themeColor} centeredContent={false}>
					<Animated.View
						style={StyleSheet.flatten([
							stylesLayout.topButtons,
							stylesLayout.topRightButton,
							{
								backgroundColor: themeColors[themeColor].secondary,
								zIndex: 1000,
							},
						])}
						entering={FadeInDown.duration(800).delay(200).springify()}
					>
						<Pressable
							onPress={() => {
								router.back();
							}}
							style={stylesLayout.paddingTopButtons}
						>
							<ArrowLeftIcon size={26} color="#fff" />
						</Pressable>
					</Animated.View>
					{splashScreen ? (
						<Animated.View style={stylesLayout.container} exiting={FadeOut.duration(400)}>
							<SplashScreenAnimation />
						</Animated.View>
					) : (
						<Animated.ScrollView style={stylesLayout.flex} entering={FadeIn}>
							{response && <RecipeContent themeColor={themeColor} recipe={response} />}
						</Animated.ScrollView>
					)}
				</LayoutBackground>
			)}
		</GestureDetector>
	);
}

const RecipeContent = ({ recipe, themeColor }: { recipe: Recipe, themeColor: keyof typeof themeColors }) => (
	<View style={styles.containerPrompt}>
		<Text style={styles.titleRecipe}>{recipe.titleRecipe}</Text>

		{/* Time and servings row */}
		<View style={styles.infoRow}>
			{recipe.prepTime && (
				<View style={styles.infoItem}>
					<ClockIcon size={26} color="#fff" />
					<Text style={styles.infoText}>{recipe.prepTime || "10 minutes"}</Text>
				</View>
			)}

			<View style={styles.infoItem}>
				<UsersRoundIcon size={26} color="#fff" />
				<Text style={styles.infoText}>{recipe.servings || "4 personnes"}</Text>
			</View>

			{recipe.type && (
				<View style={styles.infoItem}>
					<View style={StyleSheet.flatten([styles.bubble, { backgroundColor: themeColors[themeColor].primary }])}>
						<Text style={styles.bubbleText}>{recipe.type}</Text>
					</View>
				</View>
			)}
		</View>

		{/* Ingredients */}
		<View style={styles.sectionContainer}>
			<View style={StyleSheet.flatten([styles.sectionIconContainer, { backgroundColor: themeColors[themeColor].secondary }])}>
				<CarrotIcon size={26} color="#fff" />
			</View>
			<Text style={styles.sectionLabel}>Ingrédients</Text>
		</View>

		<View style={styles.listContainer}>
			{recipe.ingredients.map((ingredient, index) => (
				<View key={`ingredient-${index}`} style={styles.listItem}>
					<DotIcon size={28} strokeWidth={4} fill={"#fff"} color="#fff" />
					<Text style={styles.listText}>{ingredient}</Text>
				</View>
			))}
		</View>

		{/* Instructions */}
		<View style={styles.sectionContainer}>
			<View style={StyleSheet.flatten([styles.sectionIconContainer, { backgroundColor: themeColors[themeColor].secondary }])}>
				<ChefHatIcon size={26} color="#fff" />
			</View>
			<Text style={styles.sectionLabel}>Instructions</Text>
		</View>

		<View style={styles.listContainer}>
			{recipe.instructions.map((instruction, index) => (
				<View key={`instruction-${index}`} style={styles.instructionItem}>
					<View style={StyleSheet.flatten([styles.instructionNumber, { backgroundColor: themeColors[themeColor].primaryDark }])}>
						<Text style={styles.instructionNumberText}>{index + 1}</Text>
					</View>
					<Text style={styles.instructionText}>{instruction}</Text>
				</View>
			))}
		</View>

		{/* Lexicon */}
		{recipe?.lexicon && recipe.lexicon.length > 0 && (
			<>
				<View style={styles.sectionContainer}>
					<View style={StyleSheet.flatten([styles.sectionIconContainer, { backgroundColor: themeColors[themeColor].secondary }])}>
						<BookAIcon size={26} color="#fff" />
					</View>
					<Text style={styles.sectionLabel}>Lexique</Text>
				</View>
				<View style={styles.listContainer}>
					{recipe.lexicon.map((item, index) => (
						<View key={`lexicon-${index}`} style={styles.listItem}>
							<MinusIcon size={20} strokeWidth={4} color="#fff" />
							<Text style={styles.listText}>
								{item.term} : {item.definition}
							</Text>
						</View>
					))}
				</View>
			</>
		)}

		<Text style={styles.footer}>{recipe.footer}</Text>
	</View>
);

const styles = StyleSheet.create({
	containerPrompt: {
		flex: 1,
		paddingTop: 88,
		paddingBottom: 40,
		paddingHorizontal: 15,
	},
	titleRecipe: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 15,
	},
	infoRow: {
		flexDirection: "row",
		gap: 25,
		marginBottom: 30,
	},
	infoItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	infoIcon: {
		fontSize: 20,
		marginRight: 10,
	},
	infoText: {
		fontSize: 16,
		color: "#fff",
	},
	sectionContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 15,
	},
	sectionIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	sectionIcon: {
		fontSize: 22,
	},
	sectionLabel: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#fff",
	},
	listContainer: {
		marginBottom: 15,
	},
	listItem: {
		flexDirection: "row",
		marginBottom: 8,
		paddingLeft: 6,
		gap: 8,
		alignItems: "center",
	},
	instructionItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 17,
		marginLeft: 3,
	},
	instructionNumber: {
		width: 34,
		height: 34,
		borderRadius: 99,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	instructionNumberText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#FFF",
	},
	instructionText: {
		fontSize: 15,
		color: "#fff",
		flex: 1,
	},
	listText: {
		fontSize: 15,
		color: "#fff",
		flex: 1,
		lineHeight: 24,
	},
	footer: {
		fontSize: 15,
		color: "#fff",
		marginTop: 5,
		fontStyle: "italic",
	},
	bubbleText: {
		fontSize: 14,
		color: "#fff",
		fontWeight: "bold",
	},
	bubble: {
		borderRadius: 99,
		paddingHorizontal: 12,
		paddingVertical: 4,
	},
});
