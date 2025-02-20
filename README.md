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

eas build -p android --profile preview

// create consistent alias url hosted
eas deploy --alias dev

// test server (api routes)
npx expo serve 

// export web
npx expo export --platform web



