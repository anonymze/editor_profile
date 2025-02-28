import { getStorageColor, getStorageLimitedAction, getStorageName, setStorageLimitedAction, themeColors, } from "@/utils/theme-storage";
import { Gesture, GestureDetector, Pressable, ScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeInDown, FadeOut, runOnJS } from "react-native-reanimated";
import SplashScreenAnimation from "@/components/splashscreen-animation";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon } from "lucide-react-native";
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
								{response && <RecipeContent recipe={response} />}
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
							{response && <RecipeContent recipe={response} />}
						</Animated.ScrollView>
					)}
				</LayoutBackground>
			)}
		</GestureDetector>
	);
}

const RecipeContent = ({ recipe }: { recipe: Recipe }) => (
	<View style={styles.containerPrompt}>
		<Text style={styles.presentation}>{recipe.presentation}</Text>
		<Text style={styles.titleRecipe}>{recipe.titleRecipe}</Text>

		{/* Time and servings row */}
		<View style={styles.infoRow}>
			<View style={styles.infoItem}>
				<Text style={styles.infoIcon}>🕙</Text>
				<Text style={styles.infoText}>{recipe.prepTime || "10 minutes"}</Text>
			</View>

			<View style={styles.infoItem}>
				<Text style={styles.infoIcon}>👥</Text>
				<Text style={styles.infoText}>{recipe.servings || "4 personnes"}</Text>
			</View>
		</View>

		{/* Ingredients */}
		<View style={styles.sectionContainer}>
			<View style={styles.sectionIconContainer}>
				<Text style={styles.sectionIcon}>🍍</Text>
			</View>
			<Text style={styles.sectionLabel}>Ingrédients</Text>
		</View>

		<View style={styles.listContainer}>
			{recipe.ingredients.map((ingredient, index) => (
				<View key={`ingredient-${index}`} style={styles.listItem}>
					<Text style={styles.listBullet}>•</Text>
					<Text style={styles.listText}>{ingredient}</Text>
				</View>
			))}
		</View>

		{/* Instructions */}
		<View style={styles.sectionContainer}>
			<View style={styles.sectionIconContainer}>
				<Text style={styles.sectionIcon}>👨‍🍳</Text>
			</View>
			<Text style={styles.sectionLabel}>Instructions</Text>
		</View>

		<View style={styles.listContainer}>
			{recipe.instructions.map((instruction, index) => (
				<View key={`instruction-${index}`} style={styles.instructionItem}>
					<View style={styles.instructionNumber}>
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
					<Text style={styles.sectionIcon}>📚</Text>
					<Text style={styles.sectionLabel}>Lexique des termes techniques :</Text>
				</View>
				<View style={styles.listContainer}>
					{recipe.lexicon.map((item, index) => (
						<View key={`lexicon-${index}`} style={styles.listItem}>
							<Text style={styles.listBullet}>•</Text>
							<Text style={styles.listText}>
								<Text style={styles.termText}>{item.term} : </Text>
								{item.definition}
							</Text>
						</View>
					))}
				</View>
			</>
		)}
	</View>
);

const styles = StyleSheet.create({
	containerPrompt: {
		flex: 1,
		paddingTop: 90,
		paddingBottom: 40,
		paddingHorizontal: 18,
	},
	presentation: {
		fontSize: 16,
		color: "#000",
		marginBottom: 20,
	},
	titleRecipe: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#000",
		marginBottom: 20,
	},
	infoRow: {
		flexDirection: "row",
		marginBottom: 30,
	},
	infoItem: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 30,
	},
	infoIcon: {
		fontSize: 20,
		marginRight: 10,
	},
	infoText: {
		fontSize: 16,
		color: "#000",
	},
	sectionContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 15,
	},
	sectionIconContainer: {
		width: 40,
		height: 40,
		backgroundColor: "#FFF8E1",
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
		color: "#000",
	},
	listContainer: {
		marginBottom: 30,
	},
	listItem: {
		flexDirection: "row",
		marginBottom: 12,
		paddingLeft: 10,
	},
	listBullet: {
		fontSize: 18,
		color: "#000",
		marginRight: 10,
		width: 15,
	},
	instructionItem: {
		flexDirection: "row",
		marginBottom: 20,
	},
	instructionNumber: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#FFA726",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	instructionNumberText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#FFF",
	},
	instructionText: {
		fontSize: 16,
		color: "#000",
		flex: 1,
		paddingTop: 10,
	},
	listText: {
		fontSize: 16,
		color: "#000",
		flex: 1,
		lineHeight: 24,
	},
	termText: {
		fontWeight: "bold",
	},
	footer: {
		fontSize: 16,
		color: "#000",
		marginTop: 20,
		textAlign: "center",
		fontStyle: "italic",
	},
});
