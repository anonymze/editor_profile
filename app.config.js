module.exports = () => ({
	expo: {
		name: "fridgy",
		slug: "fridgy",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		scheme: "myapp",
		userInterfaceStyle: "automatic",
		newArchEnabled: true,
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.anonymze.fridgy",
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/images/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			package: "com.anonymze.fridgy",
		},
		web: {
			bundler: "metro",
			output: "server",
			favicon: "./assets/images/favicon.png",
		},
		plugins: [
			"expo-router",
			[
				"expo-splash-screen",
				{
					backgroundColor: "#FFFFFF",
					image: "./assets/images/splash-icon.png",
					imageWidth: 160,
					dark: {
						image: "./assets/images/splash-icon-dark.png",
						backgroundColor: "#171717",
					},
				},
			],
			[
				"expo-image-picker",
				{
					photosPermission: "Autoriser l'accès à vos photos",
					cameraPermission: "Autoriser l'accès à votre caméra",
					microphonePermission: false,
				},
			],
		],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			eas: {
				projectId: "3c0878f0-9e8f-47b4-a642-e1d3d8084d20",
			},
		},
		runtimeVersion: "1.0.0",
	},
});
