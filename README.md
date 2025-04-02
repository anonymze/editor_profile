pnpx expo prebuild --clean

pnpm run android --device

cd android && ./gradlew clean

// FORCE KOTLIN VERSION
subprojects { project ->
    project.configurations.all {
        resolutionStrategy {
            eachDependency { details ->
                if (details.requested.group == 'org.jetbrains.kotlin') {
                    details.useVersion '1.9.24'
                }
            }
        }
    }
}

// native build on eas host (preview for internal testing with testFlight for exemple)
eas build  --profile preview

// build and submit (default to production)
eas build -s

// submit (latest) builds you have on eas expo
eas submit --platform ios --latest

// register devices to test internally (use .ipa (Ad Hoc) for exemple on the device registered)
eas device:create



// test server,locally (api routes)
npx expo serve 

// export web
npx expo export --platform web

// create consistent alias url hosted
eas deploy --alias dev
eas deploy --prod

// update app only js / assets / styles / api (need expo-updates)
eas update --channel production --message "Update js code"

The native config files Expo.plist & AndroidManifest.xml must be updated to support EAS Update. Learn more: https://expo.fyi/eas-update-config.md#native-configuration



pnpx expo-doctor

// setup sentry for native part and config
pnpx @sentry/wizard@latest -i reactNative --saas --org yann-metier --project react-native

// TODO BETTER BOTTOM SHEET (legend list ?)  + icones + route api ai + set customer updated after purchase
