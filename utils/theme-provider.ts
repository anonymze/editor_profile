import { setStatusBarBackgroundColor } from "expo-status-bar";
import { Platform } from "react-native";
import { create } from "zustand";


const themeColors = {
	blue: {
		primary: "#001ddf",
		primaryLight: "#000efd",
		primaryDark: "#000dc8",
		secondary: "#1487ff",
	},
	orange: {
		primary: "#ff6538",
		primaryLight: "#fc987f",
		primaryDark: "#f44a12",
		secondary: "#efc069",
	},
	yellow: {
		primary: "#e89150",
		primaryLight: "#e1bf8e",
		primaryDark: "#ef7c2e",
		secondary: "#c2c443",
	},
	green: {
		primary: "#009e8a",
		primaryLight: "#00b397",
		primaryDark: "#00787e",
		secondary: "#56b3cb",
	},
	purple: {
		primary: "#a31bce",
		primaryLight: "#cb69f3",
		primaryDark: "#8815b4",
		secondary: "#e574d2",
	},
} as const;

export type ThemeType = keyof typeof themeColors;

interface Theme {
	color: ThemeType;
	name: string;
	setTheme: (val: ThemeType) => void;
	setName: (val: string) => void;
}

const useTheme = create<Theme>((set) => ({
	color: "blue",
	name: "Mega kitchen",
	setTheme: (val) => {
		set({
			color: val,
		});

		if (Platform.OS === "android") setStatusBarBackgroundColor(themeColors[val].primaryLight);
	},
	setName: (val) => {
		set({
			name: val,
		});
	},
}));

export { useTheme, themeColors };
