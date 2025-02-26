import { BottomSheetFooter, BottomSheetFooterProps, BottomSheetModal, BottomSheetScrollView, } from "@gorhom/bottom-sheet";
import { View, Button, Text, StyleSheet, Platform } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Pressable } from "react-native-gesture-handler";
import { themeColors } from "@/utils/theme-storage";
import vegetables from "@/data/vegetables";
import React, { forwardRef } from "react";
import fruits from "@/data/fruits";
import { Image } from "expo-image";


export type FoodItem = (typeof fruits)[number] | (typeof vegetables)[number];

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
							.includes(
								searchQuery
									.toLowerCase()
									.normalize("NFD")
									.replace(/[\u0300-\u036f]/g, "")
							)
					),
				}))
				.filter((section) => section.data.length > 0); // Remove empty sections
		}, [searchQuery]);

		const renderFooter = React.useCallback(
			(props: BottomSheetFooterProps) => (
				<BottomSheetFooter
					{...props}
					bottomInset={Platform.OS === "android" ? 10 : 25}
					style={styles.footerContainer}
				>
					<Pressable
						style={(status) => {
							return StyleSheet.flatten([
								{
									opacity: status.pressed ? 0.5 : 1,
								},
								styles.containerTextBottom,
							]);
						}}
						onPress={() => {
							onSelect(null);
							setSelectedIds([]);
							setSearchQuery("");
							if (ref && "current" in ref) {
								ref?.current?.close();
							}
						}}
					>
						<Text style={styles.textBottomSheet}>Effacer</Text>
					</Pressable>
					<Pressable
						style={(status) => {
							return StyleSheet.flatten([
								{
									opacity: status.pressed ? 0.5 : 1,
								},
								styles.containerTextBottom,
							]);
						}}
						onPress={() => {
							onSelect(selectedIds);
							setSelectedIds([]);
							setSearchQuery("");
							if (ref && "current" in ref) {
								ref?.current?.close();
							}
						}}
					>
						<Text style={styles.textBottomSheet}>Ajouter</Text>
					</Pressable>
				</BottomSheetFooter>
			),
			[onSelect, selectedIds]
		);

		return (
			<View style={{ flex: 1 }}>
				<BottomSheetModal
					onDismiss={() => {
						setSearchQuery("");
					}}
					ref={ref}
					enablePanDownToClose={true}
					enableDynamicSizing={false}
					snapPoints={snapPoints}
					footerComponent={renderFooter}
					style={styles.paddingSheet}
				>
					<BottomSheetTextInput
						autoCapitalize="none"
						autoComplete="off"
						autoCorrect={false}
						placeholder={placeholderSearch}
						style={styles.searchInput}
						onChangeText={setSearchQuery}
					/>

					<BottomSheetScrollView style={styles.bottomSheetContent}>
						<MemoizedSections
							themeColor={themeColor}
							sections={filteredSections}
							selectedIds={selectedIds}
							onItemPress={(item) => {
								if (selectedIds.find((id) => id.id === item.id)) {
									setSelectedIds(selectedIds.filter((selected) => selected.id !== item.id));
								} else {
									setSelectedIds((prev) => [...prev, item]);
								}
							}}
						/>
					</BottomSheetScrollView>
				</BottomSheetModal>
			</View>
		);
	}
);

const MemoizedSections = React.memo(
	({
		sections,
		selectedIds,
		themeColor,
		onItemPress,
	}: {
		sections: Props["data"];
		selectedIds: FoodItem[];
		themeColor: keyof typeof themeColors;
		onItemPress: (item: FoodItem) => void;
	}) => (
		<>
			{sections.map((section) => (
				<View key={section.title} style={styles.bottomSheetListContent}>
					<View style={styles.sectionHeaderContainer}>
						<View
							style={StyleSheet.flatten([
								styles.sectionHeader,
								{ backgroundColor: themeColors[themeColor].primary },
							])}
						>
							<Text style={styles.sectionHeaderText}>{section.title}</Text>
						</View>
					</View>
					{section.data.map((item) => (
						<Pressable
							key={item.id}
							style={[
								styles.itemContainer,
								selectedIds.find((id) => id.id === item.id) && {
									backgroundColor: themeColors[themeColor].primary,
								},
							]}
							onPress={() => onItemPress(item)}
						>
							<Image style={styles.itemImage} contentFit="contain" source={item.image} alt={item.label.FR} />
							<Text
								style={[
									styles.itemText,
									selectedIds.find((id) => id.id === item.id) && styles.selectedItemText,
								]}
							>
								{item.label.FR}
							</Text>
						</Pressable>
					))}
				</View>
			))}
		</>
	),
	(prevProps, nextProps) => {
		// optional: custom comparison function
		return (
			prevProps.sections === nextProps.sections &&
			prevProps.selectedIds === nextProps.selectedIds &&
			prevProps.themeColor === nextProps.themeColor
		);
	}
);

// WE ARE DEALING WITH A CONSEQUENT LIST, SO WE USE STYLE SHEET CSS
// INSTEAD OF TAILWIND FOR PERFORMANCE REASONS

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
		gap: 12,
		alignItems: "center",
		padding: 8,
		marginVertical: 2,
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
		marginBottom: 20,
	},
	footerContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		backgroundColor: "#fff",
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
		color: "#057efe",
		fontSize: 18,
	},
});
