import { BottomSheetFooter, BottomSheetFooterProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, } from "@gorhom/bottom-sheet";
import { View, Text, StyleSheet, Platform } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Pressable } from "react-native-gesture-handler";
import { themeColors } from "@/theme/theme-storage";
import vegetables from "@/data/vegetables";
import React, { forwardRef } from "react";
import { Image } from "expo-image";
import fruits from "@/data/fruit";


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

		// Render backdrop component
		// const renderBackdrop = React.useCallback(
		// 	(props: BottomSheetBackdropProps) => (
		// 		<BottomSheetBackdrop {...props} />
		// 	),
		// 	[themeColor]
		// );

		const renderFooter = React.useCallback(
			(props: BottomSheetFooterProps) => (
				<BottomSheetFooter {...props} style={styles.footerContainer}>
					<Pressable
						style={styles.containerTextBottom}
						onPress={() => {
							onSelect(null);
							setSelectedIds([]);
							setSearchQuery("");
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
							setSearchQuery("");
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

		return (
			<BottomSheetModalProvider>
				<BottomSheetModal
					onDismiss={() => {
						setSearchQuery("");
					}}
					ref={ref}
					enablePanDownToClose={true}
					enableDynamicSizing={false}
					snapPoints={snapPoints}
					footerComponent={renderFooter}
					// backdropComponent={renderBackdrop}
					// bottomInset={Platform.OS === "android" ? 10 : 25}
					keyboardBehavior="extend"
					keyboardBlurBehavior="restore"
					android_keyboardInputMode="adjustResize"
					style={styles.paddingSheet}
					backgroundStyle={{ backgroundColor: "#fff" }}
					handleStyle={{ backgroundColor: "#fff" }}
					handleIndicatorStyle={{ backgroundColor: themeColors[themeColor].primary }}
				>
					<BottomSheetTextInput
						autoCapitalize="none"
						autoComplete="off"
						autoCorrect={false}
						placeholder={placeholderSearch}
						style={styles.searchInput}
						onSubmitEditing={(event) => {
							setSearchQuery(event.nativeEvent.text);
						}}
						returnKeyType="search"
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
			</BottomSheetModalProvider>
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
							{item.image && <Image style={styles.itemImage} contentFit="contain" source={item.image} alt={item.label.FR} />}
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
		// optional: custom comp
		// arison function
		return (
			prevProps.sections === nextProps.sections &&
			prevProps.selectedIds === nextProps.selectedIds &&
			prevProps.themeColor === nextProps.themeColor
		);
	}
);

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
		gap: 2,
		marginBottom: 30,
	},
	footerContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: "#fff",
		height: Platform.OS === "android" ? 55 : 70,
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
