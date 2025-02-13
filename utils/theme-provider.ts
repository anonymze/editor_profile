import { create } from "zustand";


type ThemeType = string;

interface Theme {
	color: ThemeType;
	setTheme: (val: ThemeType) => void;
}

const useTheme = create<Theme>((set) => ({
	color: "#999999",
	setTheme: (val) =>
		set({
			color: val,
		}),
}));

export default useTheme;

export const themeColors = {
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
		secondary: "#ffd700",
	},
	yellow: {
		primary: "#e89150",
		primaryLight: "#e1bf8e",
		primaryDark: "#ef7c2e",
		secondary: "#ffa500",
	},
	green: {
		primary: "#009e8a",
		primaryLight: "#00b397",
		primaryDark: "#00787e",
		secondary: "#008000",
	},
	purple: {
		primary: "#a31bce",
		primaryLight: "#cb69f3",
		primaryDark: "#8815b4",
		secondary: "#800080",
	},
} as const;
