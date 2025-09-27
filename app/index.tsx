import { BottomSheetSelect, FoodItem } from "@/components/bottom-sheet-select";
import { ButtonRadialGradient } from "@/components/radial-gradient";
import { TextGradient } from "@/components/text-gradient";
import { useCustomer } from "@/context/customer";
import { initialSections } from "@/data/sections";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import {
  getStorageColor,
  getStorageLimitedAction,
  setStorageLimitedAction,
  themeColors,
} from "@/theme/theme-storage";
import {
  customerAppStoreHasSubscriptions,
  getOfferingsAppStore,
} from "@/utils/in-app-purchase";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Application from "expo-application";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { BadgeInfoIcon, MinusIcon, UserRoundPenIcon } from "lucide-react-native";
import {
  Fragment,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeOutDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const DEFAULT_TRANSLATE_FRIDGE = 110;
const DEFAULT_SCALE_FRIDGE = 1.22;

function selectionReducer(
  oldState: Map<FoodItem["id"], FoodItem>,
  action: ActionReducerFoodItems,
): Map<FoodItem["id"], FoodItem> {
  const newState = new Map(oldState);

  switch (action.type) {
    case "ADD":
      if (newState.size === 10) {
        Alert.alert(
          "Attention",
          "Vous ne pouvez pas ajouter plus de 10 ingrédients.",
          [{ text: "OK" }],
        );
        break;
      }
      newState.set(action.item.id, action.item);
      break;
    case "REMOVE":
      newState.delete(action.item.id);
      break;
    case "CLEAR":
      newState.clear();
      break;
  }

  return newState;
}

export type ActionReducerFoodItems =
  | {
      type: "ADD" | "REMOVE";
      item: FoodItem;
    }
  | {
      type: "CLEAR";
      item?: never;
    };

export default function Page() {
  const insets = useSafeAreaInsets();
  const { customer } = useCustomer();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedValues, dispatch] = useReducer<
    Map<FoodItem["id"], FoodItem>,
    [ActionReducerFoodItems]
  >(selectionReducer, new Map());
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
    // heightTooltip,
    animateTooltip,
    hideTooltip,
    buttonsOpacity,
    fridgeStyle,
    translateYFridge,
    scaleFridge,
  } = useAnimations(setIsTooltipAnimating);

  // Watch for changes in selected items
  useEffect(() => {
    if (selectedValues.size > 0) {
      // Animate back to original position
      translateYFridge.value = 0;
      scaleFridge.value = 1;
    } else {
      // Move down when no items are selected
      translateYFridge.value = DEFAULT_TRANSLATE_FRIDGE;
      scaleFridge.value = DEFAULT_SCALE_FRIDGE;
    }
  }, [selectedValues]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        bottomSheetRef.current?.close();
      };
    }, []),
  );

  useEffect(() => {
    scale1.value = withRepeat(
      withTiming(1.5, {
        duration: 5000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    scale2.value = withRepeat(
      withTiming(1.1, {
        duration: 5000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    opacity.value = withRepeat(
      withTiming(0, {
        duration: 5000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    translateY.value = withDelay(
      600,
      withRepeat(
        withTiming(8, {
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );
  }, []);

  return (
    <LayoutBackground color={themeColor} centeredContent={false}>
      <ScrollView contentContainerStyle={{ paddingBottom: 135, flexGrow: 1 }}>
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
            style={stylesLayout.paddingTopButtons}
            onPress={() => router.push("/profile-edit")}
          >
            <UserRoundPenIcon size={24} color="#fff" />
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(200).springify()}
          style={StyleSheet.flatten([
            stylesLayout.topButtons,
            stylesLayout.topLeftButton,
            {
              backgroundColor: themeColors[themeColor].secondary,
              borderRadius: 99,
              // opacity: isTooltipAnimating ? 0.7 : 1,
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

        {showTooltip && (
          <Animated.View
            style={StyleSheet.flatten([
              styles.tooltip,
              {
                backgroundColor: themeColors[themeColor].secondaryRgba(0.96),
                width: widthTooltip,
                opacity: opacityTooltip,
                flex: 1,
              },
            ])}
          >
            <View style={styles.tooltipViewAbsolute}>
              <Text style={styles.tooltipTextTitle}>
                Bienvenue sur {Application.applicationName}.
              </Text>
              <Text style={styles.tooltipText}>
                En appuyant sur le{" "}
                <Text style={styles.tooltipUnderlineText}>frigo</Text> vous
                pouvez ajouter des ingrédients.
              </Text>

              <Text style={styles.tooltipText}>
                Un{" "}
                <Text style={styles.tooltipUnderlineText}>
                  minimum de 3 ingrédients
                </Text>{" "}
                est requis pour trouver une recette.
              </Text>

              <Text style={styles.tooltipText}>
                En version gratuite, vous êtes limité sur vos recettes. Il vous
                en reste :
              </Text>
              <TextGradient
                color={themeColor}
                text={
                  customerAppStoreHasSubscriptions(customer)
                    ? "∞"
                    : getStorageLimitedAction()
                }
                home
                style={{ fontSize: 60, marginTop: 0 }}
              />
            </View>

            <Animated.View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
                opacity: buttonsOpacity,
              }}
            >
              <TouchableOpacity
                disabled={
                  !showTooltip ||
                  (customerAppStoreHasSubscriptions(customer) ?? true)
                }
                onPress={async () => {
                  const offerings = await getOfferingsAppStore();
                  if (!offerings) return;

                  router.push({
                    pathname: "/subscription",
                    params: {
                      offerings: JSON.stringify(offerings),
                    },
                  });
                }}
                style={{
                  opacity:
                    customerAppStoreHasSubscriptions(customer) === null
                      ? 0.6
                      : customerAppStoreHasSubscriptions(customer)
                        ? 0.6
                        : 1,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  padding: 11,
                  borderRadius: 10,
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  Je m'abonne
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowTooltip(false);
                  hideTooltip();
                }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: 11,
                  borderRadius: 10,
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "500",
                  }}
                >
                  Compris
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}

        <View style={styles.highPaddingTop}>
          <Animated.View entering={enteringAnimationLeft()}>
            <TextGradient
              color={themeColor}
              text={`${Application.applicationName?.toUpperCase()} !`}
              style={{ fontSize: height < 630 || width < 400 ? 60 : 75 }}
            />
          </Animated.View>

          <Animated.View style={fridgeStyle}>
            <Animated.View
              style={stylesLayout.centerContent}
              entering={FadeInDown.duration(800).delay(400).springify()}
            >
              <Pressable
                onPress={() => {
                  bottomSheetRef.current?.present();
                }}
              >
                <Animated.View
                  style={StyleSheet.flatten([
                    stylesLayout.centerContent,
                    bounceStyle,
                  ])}
                >
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

            {selectedValues.size === 0 && (
              <Animated.View
                style={styles.arrowIndicator}
                entering={FadeInLeft.duration(600).delay(900).springify()}
              >
                <Image
                  source={require("@/assets/images/arrow.svg")}
                  style={styles.arrowImage}
                  contentFit="contain"
                />
              </Animated.View>
            )}
          </Animated.View>
        </View>

        {selectedValues.size > 0 ? (
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
              {Array.from(selectedValues.values()).map((value) => (
                <WiggleIngredient
                  key={value.id}
                  value={value}
                  dispatch={dispatch}
                  themeColor={themeColor}
                  wiggleRotation={null}
                  latestBatchRef={latestBatchRef}
                />
              ))}
            </View>
          </Fragment>
        ) : null}

        <BottomSheetSelect
          selectedValues={selectedValues}
          dispatch={dispatch}
          data={initialSections}
          placeholderSearch="Chercher des ingrédients"
          ref={bottomSheetRef}
          themeColor={themeColor}
        />
      </ScrollView>
      {selectedValues.size >= 3 && (
        <Animated.View
          style={StyleSheet.flatten([
            stylesLayout.bottomButton,
            {
              alignSelf: "center",
              marginBottom: Platform.OS === "ios" ? 0 : insets.bottom / 2,
            },
          ])}
          entering={enteringAnimation()}
        >
          <ButtonRadialGradient
            onPress={async () => {
              if (getStorageLimitedAction() < 1) {
                setShowTooltip(true);
                animateTooltip();
                return;
              }

              router.push({
                pathname: "/recipe",
                params: {
                  customerID: customer?.originalAppUserId,
                  prompt: Array.from(selectedValues.values())
                    .map((value) => value.label.FR)
                    .join(","),
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
    </LayoutBackground>
  );
}

const WiggleIngredient = ({
  value,
  dispatch,
  themeColor,
  wiggleRotation,
  latestBatchRef,
}: {
  value: FoodItem;
  dispatch: React.Dispatch<ActionReducerFoodItems>;
  themeColor: any;
  wiggleRotation: any;
  latestBatchRef: React.RefObject<FoodItem[]>;
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    const randomDelay = Math.random() * 200;
    setTimeout(() => {
      rotation.value = withRepeat(
        withTiming(1, {
          duration: 150,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        true,
      );
    }, randomDelay);
  }, []);

  const wiggleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={styles.ingredientItem}
      exiting={FadeOutDown.duration(300)}
      entering={FadeInDown.duration(300)
        .delay(latestBatchRef.current.indexOf(value) * 100)
        .springify()}
    >
      <Animated.View style={wiggleStyle}>
        <Pressable
          onPress={() => dispatch({ type: "REMOVE", item: value })}
          style={styles.ingredientPressable}
        >
          <View style={styles.ingredientContent}>
            <Image
              placeholderContentFit="contain"
              placeholder={require("@/assets/images/fridge.png")}
              source={value.image}
              style={styles.imageIngredients}
            />
            <Text style={styles.ingredientItemText}>{value.label.FR}</Text>
          </View>
          <View
            style={[
              styles.minusIcon,
              //@ts-ignore
              { backgroundColor: themeColors[themeColor].secondary },
            ]}
          >
            <MinusIcon size={14} color="#fff" />
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

const useAnimations = (
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const scale1 = useSharedValue(0.7);
  const scale2 = useSharedValue(0.5);
  const opacity = useSharedValue(0.4);
  const translateY = useSharedValue(0);
  const opacityTooltip = useSharedValue(0);
  const widthTooltip = useSharedValue(0);
  // const heightTooltip = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const translateYFridge = useSharedValue(DEFAULT_TRANSLATE_FRIDGE);
  const scaleFridge = useSharedValue(DEFAULT_SCALE_FRIDGE);

  const animateTooltip = () => {
    runOnJS(setIsAnimating)(true);

    opacityTooltip.value = withTiming(1, {
      duration: 280,
      easing: Easing.linear,
    });

    widthTooltip.value = withTiming(
      width - 40,
      {
        duration: 280,
        easing: Easing.elastic(1.1),
      },
      () => {
        runOnJS(setIsAnimating)(false);
      },
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
      }),
    );

    const initialWidth = width - 40;

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
        runOnJS(setIsAnimating)(false);
      },
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
    [],
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
    [],
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
    [],
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

  const fridgeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(translateYFridge.value, {
            damping: 15,
            stiffness: 100,
          }),
        },
        {
          scale: withSpring(scaleFridge.value, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
    };
  });

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
    translateYFridge,
    // heightTooltip,
    buttonsOpacity,
    animateTooltip,
    hideTooltip,
    fridgeStyle,
    scaleFridge,
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
    width: 180,
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
    rowGap: 15,
    columnGap: 30,
    paddingLeft: 20,
    paddingTop: 18,
  },
  ingredientItem: {
    alignItems: "center",
    gap: 5,
  },
  ingredientPressable: {
    alignItems: "center",
    position: "relative",
    transform: [{ scale: 1 }],
  },
  ingredientContent: {
    alignItems: "center",
    gap: 5,
  },
  ingredientItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  imageIngredients: {
    width: height > 660 ? 50 : 40,
    height: height > 660 ? 50 : 40,
  },
  minusIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltip: {
    position: "absolute",
    top: 90,
    left: 20,
    // height: 400,
    zIndex: 9,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
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
    width: width - 80,
  },
  arrowIndicator: {
    position: "absolute",
    left: width / 2 - 140, // Position to the left of centered fridge
    top: 95,
    transform: [{ translateY: 0 }],
    zIndex: 100,
    width: 5,
    height: 5,
  },
  arrowImage: {
    width: 40,
    height: 40,
  },
});
