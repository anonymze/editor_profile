import { BottomSheetFooter, BottomSheetSectionList, BottomSheetFooterProps, BottomSheetModal, BottomSheetScrollView, } from "@gorhom/bottom-sheet";
import { View, Button, Text, StyleSheet } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Pressable } from "react-native-gesture-handler";
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
}

const snapPoints = ["75%"];

export const BottomSheetSelect = forwardRef<BottomSheetModal, Props>(
	({ onSelect, placeholderSearch, data }, ref) => {
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
				<BottomSheetFooter {...props}>
					<View style={styles.footerContainer}>
						<Button
							title="Effacer"
							onPress={() => {
								onSelect(null);
								setSelectedIds([]);
								setSearchQuery("");
								if (ref && "current" in ref) {
									ref?.current?.close();
								}
							}}
						/>
						<Button
							title="Ajouter"
							onPress={() => {
								onSelect(selectedIds);
								setSelectedIds([]);
								setSearchQuery("");
								if (ref && "current" in ref) {
									ref?.current?.close();
								}
							}}
						/>
					</View>
				</BottomSheetFooter>
			),
			[onSelect, selectedIds]
		);

		return (
			<>
				<BottomSheetModal
					ref={ref}
					enablePanDownToClose={true}
					enableDynamicSizing={false}
					snapPoints={snapPoints}
					footerComponent={renderFooter}
					containerStyle={styles.bottomSheetContainer}
				>
					<BottomSheetTextInput
						placeholder={placeholderSearch}
						style={styles.searchInput}
						onChangeText={setSearchQuery}
					/>

					<BottomSheetScrollView style={styles.bottomSheetContent}>
						<MemoizedSections
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
			</>
		);
	}
);

const MemoizedSections = React.memo(
	({
		sections,
		selectedIds,
		onItemPress,
	}: {
		sections: Props["data"];
		selectedIds: FoodItem[];
		onItemPress: (item: FoodItem) => void;
	}) => (
		<>
			{sections.map((section) => (
				<View key={section.title} style={styles.bottomSheetListContent}>
					<View style={styles.sectionHeaderContainer}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionHeaderText}>{section.title}</Text>
						</View>
					</View>
					{section.data.map((item) => (
						<Pressable
							key={item.id}
							style={[
								styles.itemContainer,
								selectedIds.find((id) => id.id === item.id) && styles.selectedItemBackground,
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
		return prevProps.sections === nextProps.sections && prevProps.selectedIds === nextProps.selectedIds;
	}
);

// WE ARE DEALING WITH A CONSEQUENT LIST, SO WE USE STYLE SHEET CSS
// INSTEAD OF TAILWIND FOR PERFORMANCE REASONS

const styles = StyleSheet.create({
	sectionHeaderContainer: {
		flexDirection: "row",
	},
	sectionHeader: {
		backgroundColor: "red",
		borderRadius: 8,
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
	selectedItemBackground: {
		backgroundColor: "red",
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
		borderRadius: 15,
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
		paddingVertical: 8,
		backgroundColor: "#ffffff",
	},
});
