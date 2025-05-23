module.exports = () => ({
	expo: {
		name: "Fridgy",
		slug: "fridgy",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		scheme: "fridgy",
		newArchEnabled: true,
		// theme
		userInterfaceStyle: "automatic",
		updates: {
			enabled: false,
		},
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.anonymze.fridgy",
		},
		android: {
			edgeToEdgeEnabled: false,
			// adaptiveIcon: {
			// 	foregroundImage: "./assets/images/adaptive-icon.png",
			// 	backgroundColor: "#ffffff",
			// },
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
				projectId: "0706ee30-c626-47b7-90cc-c5f1f4a2703d",
			},
		},
		runtimeVersion: "1.0.0",
	},
});
