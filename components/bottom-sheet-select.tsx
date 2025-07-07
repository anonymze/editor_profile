import { ActionReducerFoodItems } from "@/app";
import { themeColors } from "@/theme/theme-storage";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React, { ActionDispatch, forwardRef } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

const snapPoints = ["70%"];

export const BottomSheetSelect = forwardRef<BottomSheetModal, Props>(
  ({ selectedValues, dispatch, placeholderSearch, data, themeColor }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const searchInputRef = React.useRef<TextInput>(null);
    const insets = useSafeAreaInsets();

    const dynamicFooterStyle = {
      ...styles.footerContainer,
      height:
        Platform.OS === "android" ? 50 + insets.bottom : 70 + insets.bottom,
      paddingBottom:
        Platform.OS === "android" ? 10 + insets.bottom : 15 + insets.bottom,
    };

    // filter sections based on search query
    const filteredSections = React.useMemo(() => {
      if (!searchQuery) return data;

      return data
        .map((section) => ({
          title: section.title,
          data: section.data.filter((item) =>
            item.label.FR.toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(searchQuery),
          ),
        }))
        .filter((section) => section?.data?.length > 0); // Remove empty sections
    }, [searchQuery]);

    const resetSearchInput = React.useCallback(() => {
      setSearchQuery("");
      if (searchInputRef.current) {
        searchInputRef.current.clear();
      }
    }, []);

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
            Sélectionnez plusieurs ingrédients
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
                Annuler
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
      </BottomSheetModal>
    );
  },
);

function ItemComponent<T extends FoodItem>({
  item,
  isSelected,
  dispatch,
  themeColor,
}: {
  item: T;
  isSelected: boolean;
  dispatch: ActionDispatch<[ActionReducerFoodItems]>;
  themeColor: keyof typeof themeColors;
}) {
  return (
    <Pressable
      key={item.id}
      style={[
        styles.itemContainer,
        isSelected && {
          backgroundColor: themeColors[themeColor].primary,
        },
      ]}
      onPress={() => {
        if (isSelected) {
          dispatch({
            type: "REMOVE",
            item,
          });
        } else {
          dispatch({
            type: "ADD",
            item,
          });
        }
      }}
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
});
