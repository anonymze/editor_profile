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
