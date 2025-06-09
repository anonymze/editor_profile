import { Text, StyleSheet, Platform, TextInput, View } from "react-native";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import React, { Dispatch, forwardRef, SetStateAction } from "react";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Pressable } from "react-native-gesture-handler";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { themeColors } from "@/theme/theme-storage";
import { Image } from "expo-image";


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
	onSelect: (values: FoodItem[] | null) => void;
	themeColor: keyof typeof themeColors;
}

const snapPoints = ["75%"];

export const BottomSheetSelect = forwardRef<BottomSheetModal, Props>(
	({ onSelect, placeholderSearch, data, themeColor }, ref) => {
		const [searchQuery, setSearchQuery] = React.useState("");
		const [selectedIds, setSelectedIds] = React.useState<FoodItem[]>([]);
		const searchInputRef = React.useRef<TextInput>(null);

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
							.includes(searchQuery)
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
			handleIndicatorStyle={{ backgroundColor: themeColors[themeColor].primary }}
		>
			{Platform.OS === "android" ? (
				<BottomSheetTextInput
					autoCapitalize="none"
					autoCorrect={true}
					placeholder={placeholderSearch}
					placeholderTextColor="rgba(0, 0, 0, 0.5)"
					style={styles.searchInput}
					onSubmitEditing={(event) => {
						setSearchQuery(
							event.nativeEvent.text
								.toLowerCase()
								.normalize("NFD") // Decompose characters into base + combining marks
								.replace(/[\u0300-\u036f]/g, "") // Remove all the combining marks
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
								.replace(/[\u0300-\u036f]/g, "")
						);
					}}
					returnKeyType="search"
				/>
			)}

			<LegendList
				contentContainerStyle={{
					paddingBottom: 70,
				}}
				recycleItems={true}
				data={flattenedData}
				renderItem={(props) => {
					if (props.item.type === "header") {
						return (
							<View style={styles.sectionHeaderContainer}>
								<Text
									style={[
										styles.sectionHeaderText,
										{ backgroundColor: themeColors[themeColor].primary },
									]}
								>
									{props.item.title}
								</Text>
							</View>
						);
					} else {
						return (
							<ItemComponent
								item={props.item.item}
								selectedIds={selectedIds}
								setSelectedIds={setSelectedIds}
								themeColor={themeColor}
							/>
						);
					}
				}}
				keyExtractor={(item) => item.id}
				estimatedItemSize={52}
				extraData={selectedIds}
				// drawDistance={00}
			/>

				{/* there is a visual glitch on iOS with bottom sheet footer */}
				<View style={styles.footerContainer}>
					<Pressable
						style={({ pressed }) => [styles.containerTextBottom, { opacity: pressed ? 0.5 : 1 }]}
						onPress={() => {
							onSelect(null);
							setSelectedIds([]);
							if (ref && "current" in ref) {
								ref?.current?.close();
							}
						}}
					>
						<Text style={[styles.textBottomSheet, { color: themeColors[themeColor].primary }]}>Effacer</Text>
					</Pressable>
					<Pressable
						style={({ pressed }) => [styles.containerTextBottom, { opacity: pressed ? 0.5 : 1 }]}
						onPress={() => {
							onSelect(selectedIds);
							setSelectedIds([]);
							if (ref && "current" in ref) {
								ref?.current?.close();
							}
						}}
					>
						<Text style={[styles.textBottomSheet, { color: themeColors[themeColor].primary }]}>Ajouter</Text>
					</Pressable>
				</View>
			</BottomSheetModal>
		);
	}
);

function ItemComponent<T extends FoodItem>({
	item,
	selectedIds,
	setSelectedIds,
	themeColor,
}: {
	item: T;
	selectedIds: FoodItem[];
	setSelectedIds: Dispatch<SetStateAction<FoodItem[]>>;
	themeColor: keyof typeof themeColors;
}) {
	const isSelected = selectedIds.some((selectedItem) => selectedItem.id === item.id);
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
				if (selectedIds.find((id) => id.id === item.id)) {
					setSelectedIds(selectedIds.filter((selected) => selected.id !== item.id));
				} else {
					setSelectedIds((prev) => [...prev, item]);
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
			<Text style={[styles.itemText, isSelected && styles.selectedItemText]}>{item.label.FR}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
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
		marginBottom: 15,
		marginTop: 15,
		padding: 14,
		borderRadius: 10,
		fontSize: 16,
		backgroundColor: "rgba(151, 151, 151, 0.25)",
	},
	bottomSheetContainer: {
		paddingHorizontal: 16,
	},
	bottomSheetContent: {
		marginBottom: 40,
		paddingEnd: 16,
	},
	bottomSheetListContent: {
		gap: 2,
		marginBottom: 30,
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
		height: Platform.OS === "android" ? 50 : 70,
		paddingBottom: Platform.OS === "android" ? 5 : 15,
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
		fontWeight: 500,

		paddingHorizontal: 15,
	},
});
