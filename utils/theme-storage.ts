import { MMKV } from 'react-native-mmkv';


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


const DEFAULT_NAME = "MEGA";
const DEFAULT_KEY_NAME = "name";

const DEFAULT_COLOR = "blue";
const DEFAULT_KEY_COLOR = "color";

const DEFAULT_IMAGE_URI = "https://i.ibb.co/0r00000/image.png";
const DEFAULT_KEY_IMAGE_URI = "imageUri";


export const storage = new MMKV();

export const getStorageName = () => {
	return storage.getString(DEFAULT_KEY_NAME) ?? DEFAULT_NAME;
};

export const setStorageName = (name: string) => {
	storage.set(DEFAULT_KEY_NAME, name);
};

export const getStorageColor = () => {
	return storage.getString(DEFAULT_KEY_COLOR) ?? DEFAULT_COLOR;
};

export const setStorageColor = (color: string) => {
	storage.set(DEFAULT_KEY_COLOR, color);
};

export const getStorageImageUri = () => {
	return storage.getString(DEFAULT_KEY_IMAGE_URI) ?? DEFAULT_IMAGE_URI;
};

export const setStorageImageUri = (imageUri: string) => {
	storage.set(DEFAULT_KEY_IMAGE_URI, imageUri);
};