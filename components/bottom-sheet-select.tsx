import BottomSheet, { BottomSheetFlashList, BottomSheetFooter, BottomSheetFooterProps, BottomSheetScrollView, } from "@gorhom/bottom-sheet";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { Text, StyleSheet, Platform, TextInput, View } from "react-native";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import React, { Dispatch, SetStateAction, forwardRef } from "react";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Pressable } from "react-native-gesture-handler";
import { themeColors } from "@/theme/theme-storage";
import { FlashList } from "@shopify/flash-list";
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

export const BottomSheetSelect = forwardRef<BottomSheet, Props>(
	({ onSelect, placeholderSearch, data, themeColor }, ref) => {
		const [searchQuery, setSearchQuery] = React.useState("");
		const [selectedIds, setSelectedIds] = React.useState<FoodItem[]>([]);
		const { height } = useReanimatedKeyboardAnimation();
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

		const renderFooter = React.useCallback(
			(props: BottomSheetFooterProps) => (
				<BottomSheetFooter {...props} style={styles.footerContainer}>
					<Pressable
						style={styles.containerTextBottom}
						onPress={() => {
							onSelect(null);
							setSelectedIds([]);
							if (ref && "current" in ref) {
								ref?.current?.close();
							}
						}}
					>
						{({ pressed }) => (
							<Text
								style={StyleSheet.flatten([
									styles.textBottomSheet,
									{ color: themeColors[themeColor].primary, opacity: pressed ? 0.5 : 1 },
								])}
							>
								Effacer
							</Text>
						)}
					</Pressable>
					<Pressable
						style={styles.containerTextBottom}
						onPress={() => {
							onSelect(selectedIds);
							setSelectedIds([]);
							if (ref && "current" in ref) {
								ref?.current?.close();
							}
						}}
					>
						{({ pressed }) => (
							<Text
								style={StyleSheet.flatten([
									styles.textBottomSheet,
									{ color: themeColors[themeColor].primary, opacity: pressed ? 0.5 : 1 },
								])}
							>
								Ajouter
							</Text>
						)}
					</Pressable>
				</BottomSheetFooter>
			),
			[onSelect, selectedIds]
		);

		const resetSearchInput = React.useCallback(() => {
			setSearchQuery("");
			if (searchInputRef.current) {
				searchInputRef.current.clear();
			}
		}, []);

		return (
			<BottomSheet
				// initially closed
				index={-1}
				onClose={resetSearchInput}
				ref={ref}
				enablePanDownToClose={true}
				enableDynamicSizing={false}
				snapPoints={snapPoints}
				footerComponent={renderFooter}
				keyboardBehavior="extend"
				keyboardBlurBehavior="restore"
				android_keyboardInputMode="adjustResize"
				style={styles.paddingSheet}
				backgroundStyle={{ backgroundColor: "#fff" }}
				handleStyle={{ backgroundColor: "#fff" }}
				handleIndicatorStyle={{ backgroundColor: themeColors[themeColor].primary }}
			>
				{/* <BottomSheetTextInput
					autoCapitalize="none"
					autoComplete="off"
					autoCorrect={false}
					placeholder={placeholderSearch}
					style={styles.searchInput}
					onSubmitEditing={(event) => {
						setSearchQuery(event.nativeEvent.text);
					}}
					returnKeyType="search"
				/> */}

				<TextInput
					ref={searchInputRef}
					autoCapitalize="none"
					autoCorrect={true}
					placeholder={placeholderSearch}
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

				{/* <BottomSheetScrollView style={styles.bottomSheetContent}> */}
				<BottomSheetFlashList
					contentContainerStyle={{
						paddingBottom: 85,
					}}
					data={filteredSections?.[0]?.data ?? []}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<ItemComponentFlashList
							item={item}
							selectedIds={selectedIds}
							setSelectedIds={setSelectedIds}
							themeColor={themeColor}
						/>
					)}
					estimatedItemSize={45}
					extraData={selectedIds}
					drawDistance={350}
				/>
				{/* <LegendList
					recycleItems={false}
					data={filteredSections?.[0]?.data ?? []}
					renderItem={(props) => (
						<ItemComponent
							{...props}
							selectedIds={selectedIds}
							setSelectedIds={setSelectedIds}
							themeColor={themeColor}
						/>
					)}
					keyExtractor={(item) => item.id}
					estimatedItemSize={50}
					extraData={selectedIds}
					drawDistance={350}
				/> */}
				{/* </BottomSheetScrollView> */}
			</BottomSheet>
		);
	}
);

function ItemComponent<T extends FoodItem>({
	item,
	useRecyclingEffect,
	useRecyclingState,
	selectedIds,
	setSelectedIds,
	themeColor,
}: {
	item: T;
	useRecyclingEffect: LegendListRenderItemProps<T>["useRecyclingEffect"];
	useRecyclingState: LegendListRenderItemProps<T>["useRecyclingState"];
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

function ItemComponentFlashList({
	item,
	selectedIds,
	setSelectedIds,
	themeColor,
}: {
	item: FoodItem;
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
				console.log(
					`Item ${item.id} pressed. Current selection: ${isSelected ? "selected" : "not selected"}`
				);

				if (isSelected) {
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
	},
	sectionHeader: {
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 4,
		marginBottom: 6,
	},
	sectionHeaderText: {
		color: "#ffffff",
		fontSize: 18,
		fontWeight: "bold",
	},
	itemContainer: {
		flexDirection: "row",
		gap: 20,
		alignItems: "center",
		padding: 8,
		marginVertical: 4,
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
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 1000,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: "#fff",
		height: Platform.OS === "android" ? 0 : 70,
		paddingBottom: Platform.OS === "android" ? 0 : 15,
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
	},
});
