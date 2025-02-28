import { getStorageColor, getStorageLimitedAction, getStorageName, setStorageLimitedAction, themeColors, } from "@/utils/theme-storage";
import { Gesture, GestureDetector, Pressable, ScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeInDown, FadeOut, runOnJS } from "react-native-reanimated";
import SplashScreenAnimation from "@/components/splashscreen-animation";
import RecipeDisplay, { RecipeData } from "@/components/recipe-display";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon } from "lucide-react-native";
import * as Application from "expo-application";
import { fetch as expoFetch } from "expo/fetch";


export default function Page() {
	const themeColor = getStorageColor();
	const [splashScreen, setSplashScreen] = useState(false);
	const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
	const { prompt, vendorId } = useLocalSearchParams();

	useEffect(() => {
		return;
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

				// Parse the response as JSON
				const data = await response.json();
				setRecipeData(data);
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

	// Sample recipe data for testing when API is not available
	const sampleRecipeData: RecipeData = {
		title: "Salade de fruits exotiques à la banane et à l'abricot",
		prepTime: "15 minutes",
		cookTime: null,
		servings: 4,
		ingredients: [
			"Abricot (4)",
			"Ananas (1)",
			"Banane (2)",
			"Jus de citron (1 cuillère à soupe)",
			"Miel (1 cuillère à soupe) (optionnel)",
			"Sucre (1 cuillère à soupe) (optionnel)"
		],
		instructions: [
			"Épluchez les bananes et coupez-les en rondelles.",
			"Épluchez l'ananas et coupez-le en petits dés.",
			"Lavez les abricots, coupez-les en deux, retirez le noyau et coupez la chair en petits morceaux.",
			"Dans un grand bol, mélangez les bananes, les dés d'ananas et les morceaux d'abricots.",
			"Ajoutez le jus de citron et mélangez bien.",
			"Si vous le souhaitez, ajoutez une cuillère à soupe de miel et une cuillère à soupe de sucre pour sucrer légèrement la salade de fruits.",
			"Mélangez bien et laissez reposer au réfrigérateur pendant au moins 30 minutes pour que les saveurs se mélangent."
		],
		lexicon: [
			{
				term: "Éplucher",
				definition: "Enlever la peau d'un fruit ou d'un légume."
			},
			{
				term: "Dés",
				definition: "Petits morceaux de forme cubique."
			},
			{
				term: "Mélanger",
				definition: "Remuer les ingrédients pour les combiner uniformément."
			},
			{
				term: "Réfrigérateur",
				definition: "Appareil qui permet de conserver les aliments au frais."
			}
		],
		footer: "Fridgy vous souhaite une excellente cuisine !"
	};

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
								<View style={styles.containerPrompt}>
									<RecipeDisplay recipe={recipeData || sampleRecipeData} />
								</View>
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
							<View style={styles.containerPrompt}>
								<RecipeDisplay recipe={recipeData || sampleRecipeData} />
							</View>
						</Animated.ScrollView>
					)}
				</LayoutBackground>
			)}
		</GestureDetector>
	);
}

const styles = StyleSheet.create({
	containerPrompt: {
		flex: 1,
		paddingTop: 100,
		paddingBottom: 40,
		paddingHorizontal: 18,
	},
	containerText: {
		fontSize: 18,
		color: "#000",
	},
});
