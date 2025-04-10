import { customerAppStoreHasSubscriptions, getOfferingsAppStore, purchaseFirstSubscriptionAvailable, } from "@/utils/in-app-purchase";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowLeftIcon, CheckIcon, StarIcon, UserRoundIcon } from "lucide-react-native";
import Animated, { FadeIn, FadeInDown, runOnJS } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { getStorageColor, themeColors } from "@/theme/theme-storage";
import { PurchasesOfferings } from "react-native-purchases";
import { useCustomer } from "@/context/customer";
import * as WebBrowser from "expo-web-browser";
import React, { useMemo } from "react";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";


const TERMS_URL =
	Platform.OS === "ios"
		? "https://www.apple.com/legal/internet-services/itunes/us/terms.html"
		: "https://play.google.com/intl/en-us_us/about/play-terms/index.html";

const PRIVACY_URL = "https://www.privacypolicies.com/live/fc87e6e8-e4d5-4250-8ee1-fa0b1af85a2e";

export default function Subscription() {
	const { offerings} = useLocalSearchParams<{offerings: string}>();	
	const offeringsParsed = JSON.parse(offerings);

	console.log(offeringsParsed.current.monthly.product);
	const [purchasing, setPurchasing] = React.useState(false);
	const themeColor = getStorageColor();
	const { customer, setCustomer } = useCustomer();

	if (customerAppStoreHasSubscriptions(customer)) {
		return <Redirect href="../" />;
	}

	const panGesture = useMemo(
		() =>
			Gesture.Pan()
				.activeOffsetX([-20, 20])
				.onEnd((event) => {
					// swipe left only
					if (event.translationX > 50) {
						runOnJS(router.push)("/");
					}
				}),
		[]
	);

	const purchase = React.useCallback(async () => {
		setPurchasing(true);
		purchaseFirstSubscriptionAvailable()
			.then((result) => {
				// result can be undefined if for some reason the purchase is not available (on emulator, for example)
				if (result?.customerInfo) {
					// Sentry.addBreadcrumb({
					// 	category: 'subscription',
					// 	message: 'Subscription purchase successful',
					// 	level: 'info',
					// });

					// Sentry.captureMessage('Subscription purchase completed', {
					// 	level: 'info',
					// 	tags: {
					// 		subscriptionStatus: result.customerInfo.activeSubscriptions.length > 0 ? 'active' : 'inactive'
					// 	},
					// 	extra: {
					// 		subscriptions: result.customerInfo.entitlements.active,
					// 		originalAppUserId: result.customerInfo.originalAppUserId,
					// 	},
					// });

					setCustomer(result.customerInfo);
				}
			})
			.catch(() => {})
			.finally(() => {
				setPurchasing(false);
			});
	}, []);

	return (
		<GestureDetector gesture={panGesture}>
			<View style={{ flex: 1 }} collapsable={false}>
				<LayoutBackground color={themeColor} centeredContent={true}>
					{purchasing && (
						<Animated.View entering={FadeIn.duration(400)} style={styles.subscriptionContainer}>
							<ActivityIndicator color="#000" />
						</Animated.View>
					)}

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
						<Pressable
							onPress={() => {
								router.push("/");
							}}
							style={stylesLayout.paddingTopButtons}
						>
							<ArrowLeftIcon size={26} color="#fff" />
						</Pressable>
					</Animated.View>

					<Animated.View
						style={{
							width: "100%",
							alignItems: "center",
						}}
						entering={FadeInDown.duration(800).delay(200).springify()}
					>
						<View style={styles.titleContainer}>
							<StarIcon size={20} color="#fde047" />
							<Text style={styles.titleText}>Avantages Premium</Text>
							<StarIcon size={20} color="#fde047" />
						</View>
						<BlurView intensity={10} style={styles.planCard}>
							<View style={styles.headerContainer}>
								<View>
									<Text style={styles.planName}>{offeringsParsed.current.serverDescription}</Text>
									<View style={styles.priceContainer}>
										<Text style={styles.price}>{offeringsParsed.current.monthly.product.pricePerMonthString}</Text>
										<Text style={styles.period}>/ mois</Text>
									</View>
								</View>
							</View>

							<View style={styles.featuresList}>
								<View style={styles.featureItem}>
									<CheckIcon size={20} color="#fff" />
									<Text style={styles.featureText}>Recettes illimitées</Text>
								</View>
							</View>

							<View style={styles.divider} />

							<Pressable disabled={purchasing} style={styles.selectButton} onPress={purchase}>
								<Text style={styles.selectButtonText}>S'abonner</Text>
							</Pressable>
						</BlurView>

						<Pressable style={styles.linkContainer} onPress={() => WebBrowser.openBrowserAsync(TERMS_URL)}>
							<Text style={styles.link}>Voir les conditions d'abonnement</Text>
						</Pressable>

						<Pressable style={styles.linkContainer} onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)}>
							<Text style={styles.link}>Politique de confidentialité</Text>
						</Pressable>
					</Animated.View>
				</LayoutBackground>
			</View>
		</GestureDetector>
	);
}

const styles = StyleSheet.create({
	subscriptionContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 99,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	titleContainer: {
		height: 40,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 5,
		marginBottom: 20,
	},
	titleText: {
		color: "#fff",
		fontSize: 22,
		lineHeight: 22,
		fontWeight: "bold",
		alignSelf: "flex-end",
	},
	planCard: {
		width: "90%",
		justifyContent: "center",
		borderRadius: 20,
		padding: 24,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		overflow: "hidden",
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 15,
		marginBottom: 30,
	},
	planName: {
		fontSize: 24,
		fontWeight: "700",
		color: "#fff",
		marginBottom: 8,
	},
	priceContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 3,
	},
	price: {
		fontSize: 28,
		lineHeight: 28,
		fontWeight: "800",
		color: "#fff",
	},
	period: {
		fontSize: 16,
		color: "#fff",
		opacity: 0.7,
	},
	featuresList: {
		gap: 16,
		marginBottom: 20,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	featureText: {
		color: "#fff",
		fontSize: 16,
	},
	selectButton: {
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		padding: 16,
		borderRadius: 10,
		alignItems: "center",
	},
	selectButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	divider: {
		height: 1,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		marginBottom: 22,
	},
	link: {
		textAlign: "center",
		color: "#fff",
		fontSize: 14,
		textDecorationLine: "underline",
		fontWeight: "500",
	},
	linkContainer: {
		marginTop: 15,
	},
});
