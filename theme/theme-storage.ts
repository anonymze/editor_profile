import { MMKV } from "react-native-mmkv";


export const themeColors = {
	blue: {
		primary: "#001ddf",
		primaryLight: "#000efd",
		primaryDark: "#000dc8",
		secondary: "#1487ff",
		secondaryRgba: (opacity: number = 1) => `rgba(20, 135, 255, ${opacity})`
	},
	orange: {
		primary: "#ff6538",
		primaryLight: "#fc987f",
		primaryDark: "#f44a12",
		secondary: "#efc069",
		secondaryRgba: (opacity: number = 1) => `rgba(239, 192, 105, ${opacity})`
	},
	yellow: {
		primary: "#e89150",
		primaryLight: "#e1bf8e",
		primaryDark: "#ef7c2e",
		secondary: "#fc987f",
		secondaryRgba: (opacity: number = 1) => `rgba(252, 152, 127, ${opacity})`
	},
	green: {
		primary: "#009e8a",
		primaryLight: "#00b397",
		primaryDark: "#00787e",
		secondary: "#56b3cb",
		secondaryRgba: (opacity: number = 1) => `rgba(86, 179, 203, ${opacity})`
	},
	purple: {
		primary: "#a31bce",
		primaryLight: "#cb69f3",
		primaryDark: "#8815b4",
		secondary: "#e574d2",
		secondaryRgba: (opacity: number = 1) => `rgba(229, 116, 210, ${opacity})`
	},
} as const;

export const DEFAULT_NAME = "Chef";
export const DEFAULT_KEY_NAME = "user.name";

export const DEFAULT_COLOR = "purple" as keyof typeof themeColors;
export const DEFAULT_KEY_COLOR = "user.color";

export const DEFAULT_IMAGE_URI = require("@/assets/images/profile-placeholder.png");
export const DEFAULT_KEY_IMAGE_URI = "user.image_uri";

const DEFAULT_LIMITED_ACTION = 10;
const DEFAULT_KEY_LIMITED_ACTION = "user.limited_action";

// const DEFAULT_TRIGGER_TOOLTIP_ACTION = false;
// const DEFAULT_KEY_TRIGGER_TOOLTIP_ACTION = "user.trigger_tooltip_action";

export const storage = new MMKV();

export const getStorageName = () => {
	return storage.getString(DEFAULT_KEY_NAME) ?? DEFAULT_NAME;
};

export const setStorageName = (name: string) => {
	storage.set(DEFAULT_KEY_NAME, name);
};

export const getStorageColor = () => {
	return (storage.getString(DEFAULT_KEY_COLOR) ?? DEFAULT_COLOR) as keyof typeof themeColors;
};

export const setStorageColor = (color: keyof typeof themeColors) => {
	storage.set(DEFAULT_KEY_COLOR, color);
};

export const getStorageImageUri = () => {
	return storage.getString(DEFAULT_KEY_IMAGE_URI) ?? DEFAULT_IMAGE_URI;
};

export const setStorageImageUri = (imageUri: string) => {
	storage.set(DEFAULT_KEY_IMAGE_URI, imageUri);
};

export const getStorageLimitedAction = () => {
	return storage.getNumber(DEFAULT_KEY_LIMITED_ACTION) ?? DEFAULT_LIMITED_ACTION;
}

export const setStorageLimitedAction = (action: number) => {
	storage.set(DEFAULT_KEY_LIMITED_ACTION, action);
}   

// export const getStorageTriggerTooltipAction = () => {
// 	return storage.getNumber(DEFAULT_KEY_TRIGGER_TOOLTIP_ACTION) ?? DEFAULT_TRIGGER_TOOLTIP_ACTION;
// }

// export const setStorageTriggerTooltipAction = () => {
// 	storage.set(DEFAULT_KEY_TRIGGER_TOOLTIP_ACTION, true);
// }   