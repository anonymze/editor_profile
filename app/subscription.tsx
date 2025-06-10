import { customerAppStoreHasSubscriptions, purchaseFirstSubscriptionAvailable, restorePurchases } from "@/utils/in-app-purchase";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowLeftIcon, CheckIcon, StarIcon, RotateCcwIcon } from "lucide-react-native";
import Animated, { FadeIn, FadeInDown, runOnJS } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { getStorageColor, themeColors } from "@/theme/theme-storage";
import { useCustomer } from "@/context/customer";
import * as WebBrowser from "expo-web-browser";
import React, { useMemo } from "react";
import { BlurView } from "expo-blur";


const TERMS_URL =
	Platform.OS === "ios"
		? "https://www.apple.com/legal/internet-services/itunes/fr/terms.html"
		: "https://play.google.com/intl/fr-fr_fr/about/play-terms/index.html";

const PRIVACY_URL = "https://www.privacypolicies.com/live/fc87e6e8-e4d5-4250-8ee1-fa0b1af85a2e";

export default function Subscription() {
	const { offerings } = useLocalSearchParams<{ offerings: string }>();
	const offeringsParsed = JSON.parse(offerings);
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
						runOnJS(router.replace)("/");
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

					setPurchasing(false);
					setCustomer(result.customerInfo);
					// router.replace("/");
				}
			})
			.catch(() => {
				setPurchasing(false);
			});
	}, []);

	const restore = React.useCallback(async () => {
		setPurchasing(true);
		restorePurchases()
			.then((customerInfo) => {
				// result can be null if for some reason the purchase is not available (on emulator, for example)
				if (customerInfo) {
					setPurchasing(false);
					setCustomer(customerInfo);
					// router.replace("/");
				}
			})
			.catch(() => {
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
								router.replace("/");
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
										<Text style={styles.price}>
											{offeringsParsed.current.monthly.product.pricePerMonthString}
										</Text>
										<Text style={styles.period}>/ mois</Text>
									</View>
								</View>
							</View>

							{/* <Text style={styles.autorenewal}>
								{offeringsParsed.current.monthly.product.productType === "AUTO_RENEWABLE_SUBSCRIPTION"
									? "Renouvellement automatique"
									: ""}
							</Text> */}

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

							<Pressable
								disabled={purchasing}
								style={[styles.restoreButton, { opacity: purchasing ? 0.5 : 1 }]}
								onPress={restore}
							>
								<RotateCcwIcon size={16} color="#fff" />
								<Text style={styles.restoreButtonText}>Restaurer mes achats</Text>
							</Pressable>
						</BlurView>

						<Pressable style={styles.linkContainer} onPress={() => WebBrowser.openBrowserAsync(TERMS_URL)}>
							<Text style={styles.link}>Conditions générales d'utilisation</Text>
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
	autorenewal: {
		fontSize: 14,
		color: "#fff",
		opacity: 0.7,
	},
	featuresList: {
		gap: 16,
		marginTop: 30,
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
	restoreButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		padding: 12,
		borderRadius: 8,
		marginTop: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
	},
	restoreButtonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "500",
	},
});
