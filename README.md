pnpx expo prebuild --clean
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

pnpm run android --device