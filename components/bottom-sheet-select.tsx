import { ActionReducerFoodItems } from "@/app";
import { themeColors } from "@/theme/theme-storage";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React, { ActionDispatch, forwardRef } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export type FoodItem = {
  id: string;
  co2: number;
  image: string | null;
  label: {
    FR: string;
  };
};

interface Props {
  placeholderSearch: string;
  data: {
    title: string;
    data: FoodItem[];
  }[];
  selectedValues: Map<string, FoodItem>;
  dispatch: ActionDispatch<[ActionReducerFoodItems]>;
  themeColor: keyof typeof themeColors;
}

interface FlyingIngredient {
  id: string;
  image: string | null;
  label: string;
  startPosition: { x: number; y: number };
}

const snapPoints = ["80%"];

export const BottomSheetSelect = forwardRef<BottomSheetModal, Props>(
  ({ selectedValues, dispatch, placeholderSearch, data, themeColor }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const searchInputRef = React.useRef<TextInput>(null);
    const insets = useSafeAreaInsets();
    const [flyingIngredients, setFlyingIngredients] = React.useState<
      FlyingIngredient[]
    >([]);

    const dynamicFooterStyle = {
      ...styles.footerContainer,
      height: Platform.OS === "android" ? 50 + insets.bottom : 70,
      paddingBottom: Platform.OS === "android" ? 0 + insets.bottom : 15,
    };

    // filter sections based on search query
    const filteredSections = React.useMemo(() => {
      if (!searchQuery) return data;

      return data
        .map((section) => {
          // Check if search query matches section title
          const normalizedTitle = section.title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          const titleMatches = normalizedTitle.includes(searchQuery);

          return {
            title: section.title,
            data: titleMatches
              ? section.data // If title matches, include all items from this section
              : section.data.filter((item) =>
                  item.label.FR.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .includes(searchQuery),
                ),
          };
        })
        .filter((section) => section?.data?.length > 0); // Remove empty sections
    }, [searchQuery]);

    const resetSearchInput = React.useCallback(() => {
      setSearchQuery("");
      if (searchInputRef.current) {
        searchInputRef.current.clear();
      }
    }, []);

    const triggerFlyingAnimation = React.useCallback(
      (item: FoodItem, startX: number, startY: number) => {
        // Check if we can add more animations
        if (flyingIngredients.length >= 5) return; // Max 5 concurrent animations
        
        const newFlyingIngredient: FlyingIngredient = {
          id: `flying-${item.id}-${Date.now()}`,
          image: item.image,
          label: item.label.FR,
          startPosition: { x: startX, y: startY },
        };

        setFlyingIngredients((prev) => [...prev, newFlyingIngredient]);

        // Remove the flying ingredient after animation completes (visual only)
        setTimeout(() => {
          setFlyingIngredients((prev) =>
            prev.filter((ing) => ing.id !== newFlyingIngredient.id),
          );
        }, 800); // Reduced from 1200ms to 800ms
      },
      [flyingIngredients.length],
    );

    // flatten sections into a single array with headers and items
    const flattenedData = React.useMemo(() => {
      const result: Array<
        | { type: "header"; title: string; id: string }
        | { type: "item"; item: FoodItem; id: string }
      > = [];

      filteredSections.forEach((section) => {
        if (section.data.length > 0) {
          // add section header
          result.push({
            type: "header",
            title: section.title,
            id: `header-${section.title}`,
          });

          // add section items
          section.data.forEach((item) => {
            result.push({
              type: "item",
              item,
              id: item.id,
            });
          });
        }
      });

      return result;
    }, [filteredSections]);

    return (
      <BottomSheetModal
        onDismiss={resetSearchInput}
        ref={ref}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        style={styles.paddingSheet}
        backgroundStyle={{ backgroundColor: "#fff" }}
        handleStyle={{ backgroundColor: "#fff" }}
        handleIndicatorStyle={{
          backgroundColor: themeColors[themeColor].primary,
        }}
        // Disable content panning on Android to fix scrolling issues
        enableContentPanningGesture={Platform.OS === "ios"}
        enableOverDrag={false}
      >
        <View style={styles.container}>
          {Platform.OS === "android" ? (
            <BottomSheetTextInput
              autoCapitalize="none"
              autoCorrect={true}
              placeholder={placeholderSearch}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              style={styles.searchInput}
              onChangeText={(text) => {
                setSearchQuery(
                  text
                    .toLowerCase()
                    .normalize("NFD") // Decompose characters into base + combining marks
                    .replace(/[\u0300-\u036f]/g, ""), // Remove all the combining marks
                );
              }}
              returnKeyType="search"
            />
          ) : (
            // needed because bottom sheet text input is pushing the bottom sheet up when keyboard open
            <TextInput
              ref={searchInputRef}
              autoCapitalize="none"
              autoCorrect={true}
              placeholder={placeholderSearch}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              style={styles.searchInput}
              onChangeText={(text) => {
                setSearchQuery(
                  text
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, ""),
                );
              }}
              returnKeyType="search"
            />
          )}

          <Text
            style={{
              color: "#888",
              marginBottom: 6,
            }}
          >
            Sélectionnez au moins 3 ingrédients
          </Text>

          <View style={styles.listContainer}>
            <FlashList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 75,
              }}
              estimatedItemSize={52}
              data={flattenedData}
              nestedScrollEnabled={true}
              overScrollMode="never"
              renderItem={({ item }) => {
                if (item.type === "header") {
                  return (
                    <View style={styles.sectionHeaderContainer}>
                      <Text
                        style={[
                          styles.sectionHeaderText,
                          { backgroundColor: themeColors[themeColor].primary },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                  );
                } else {
                  return (
                    <ItemComponent
                      item={item.item}
                      isSelected={selectedValues.has(item.item.id)}
                      dispatch={dispatch}
                      themeColor={themeColor}
                      onFlyingAnimation={triggerFlyingAnimation}
                    />
                  );
                }
              }}
              keyExtractor={(item) => item.id}
              extraData={selectedValues}
            />
          </View>

          {/* there is a visual glitch on iOS with bottom sheet footer */}
          <View style={dynamicFooterStyle}>
            <Pressable
              style={({ pressed }) => [
                styles.containerTextBottom,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              onPress={() => {
                dispatch({
                  type: "CLEAR",
                });
                if (ref && "current" in ref) {
                  ref?.current?.close();
                }
              }}
            >
              <Text
                style={[
                  styles.textBottomSheet,
                  { color: themeColors[themeColor].primary },
                ]}
              >
                Tout enlever
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.containerTextBottom,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              onPress={() => {
                if (ref && "current" in ref) {
                  ref?.current?.close();
                }
              }}
            >
              <Text
                style={[
                  styles.textBottomSheet,
                  { color: themeColors[themeColor].primary },
                ]}
              >
                Fermer
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Flying ingredients overlay */}
        {flyingIngredients.map((flyingIngredient) => (
          <FlyingIngredientComponent
            key={flyingIngredient.id}
            ingredient={flyingIngredient}
          />
        ))}
      </BottomSheetModal>
    );
  },
);

BottomSheetSelect.displayName = "BottomSheetSelect";

function FlyingIngredientComponent({
  ingredient,
}: {
  ingredient: FlyingIngredient;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    // Calculate movement from start to target
    const imageWidth = 50; // From styles.flyingIngredientImage
    const targetX = (width - imageWidth) / 2; // True center
    const targetY = height * 0.25; // Quarter from top
    
    
    // Calculate the translation needed
    const moveX = targetX - ingredient.startPosition.x;
    const moveY = targetY - ingredient.startPosition.y;

    translateX.value = withSpring(moveX, {
      damping: 15,
      stiffness: 100,
    });

    translateY.value = withSpring(moveY, {
      damping: 15,
      stiffness: 100,
    });

    scale.value = withTiming(
      1.2,
      {
        duration: 600,
        easing: Easing.out(Easing.ease),
      },
      () => {
        scale.value = withTiming(0.8, {
          duration: 400,
          easing: Easing.in(Easing.ease),
        });
      },
    );

    opacity.value = withTiming(
      0.9,
      {
        duration: 400,
        easing: Easing.out(Easing.ease),
      },
      () => {
        opacity.value = withTiming(0, {
          duration: 400,
          easing: Easing.in(Easing.ease),
        });
      },
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        styles.flyingIngredient, 
        {
          left: ingredient.startPosition.x - 25, // Center the image (50px / 2)
          top: ingredient.startPosition.y - 25,
        },
        animatedStyle
      ]}
    >
      <Image
        source={ingredient.image}
        style={styles.flyingIngredientImage}
        contentFit="contain"
      />
    </Animated.View>
  );
}

function ItemComponent<T extends FoodItem>({
  item,
  isSelected,
  dispatch,
  themeColor,
  onFlyingAnimation,
}: {
  item: T;
  isSelected: boolean;
  dispatch: ActionDispatch<[ActionReducerFoodItems]>;
  themeColor: keyof typeof themeColors;
  onFlyingAnimation: (item: FoodItem, startX: number, startY: number) => void;
}) {
  const itemRef = React.useRef<View>(null);

  const handlePress = () => {
    if (isSelected) {
      dispatch({
        type: "REMOVE",
        item,
      });
    } else {
      // Add ingredient immediately
      dispatch({
        type: "ADD",
        item,
      });
      
      // Trigger flying animation (purely visual) - random position from bottom
      const minX = width * 0.15; // 15% from left
      const maxX = width * 0.85; // 85% from left  
      const randomX = minX + Math.random() * (maxX - minX); // Random between 15% and 85%
      onFlyingAnimation(item, randomX, height);
    }
  };

  return (
    <View ref={itemRef}>
      <Pressable
        key={item.id}
        style={[
          styles.itemContainer,
          isSelected && {
            backgroundColor: themeColors[themeColor].primary,
          },
        ]}
        onPress={handlePress}
      >
        <Image
          placeholder={require("@/assets/images/fridge.png")}
          placeholderContentFit="contain"
          style={styles.itemImage}
          contentFit="contain"
          source={item.image}
          alt={item.label.FR}
        />
        <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
          {item.label.FR}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 8,
  },
  sectionHeaderText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    padding: 8,
    borderRadius: 6,
  },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    padding: 8,
    marginVertical: 3,
    borderRadius: 8,
  },
  itemImage: {
    width: 30,
    height: 30,
  },
  selectedItemText: {
    color: "#ffffff",
  },
  itemText: {
    fontSize: 20,
  },
  searchInput: {
    marginBottom: 10,
    marginTop: 15,
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
  listContainer: {
    flex: 1,
    height: "100%",
  },
  footerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    height: Platform.OS === "android" ? 65 : 70,
    paddingBottom: Platform.OS === "android" ? 15 : 15,
  },
  paddingSheet: {
    paddingHorizontal: 15,
  },
  containerTextBottom: {
    backgroundColor: "transparent",
    padding: 10,
    margin: 0,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  textBottomSheet: {
    fontSize: 18,
    fontWeight: "500",
    paddingHorizontal: 15,
  },
  flyingIngredient: {
    position: "absolute",
    zIndex: 9999,
    top: 0,
    left: 0,
    pointerEvents: "none",
  },
  flyingIngredientImage: {
    width: 50,
    height: 50,
  },
});
