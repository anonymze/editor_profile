module.exports = () => ({
	expo: {
		name: "Fridgy",
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
        "@sentry/react-native/expo",
        {
          "organization": "sentry org slug, or use the `SENTRY_ORG` environment variable",
          "project": "sentry project name, or use the `SENTRY_PROJECT` environment variable",
          // If you are using a self-hosted instance, update the value of the url property
          // to point towards your self-hosted instance. For example, https://self-hosted.example.com/.
          "url": "https://sentry.io/"
        }
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
