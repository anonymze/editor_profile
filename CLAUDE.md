# Recipe Generator Mobile App

## Project Overview
- **Platform**: Expo/React Native mobile app for iOS and Android
- **Purpose**: Recipe generator app based on selected fridge ingredients
- **AI Integration**: Generates personalized recipes using AI based on user-selected ingredients

## Core Dependencies
- **@shopify/flash-list**: "2.0.0-rc.11" - Efficient list rendering
- **react-native-reanimated**: "~3.17.5" - Advanced animations
- **@gorhom/bottom-sheet**: Ingredient selection modal interface

## Key Features
- Interactive fridge ingredient selection
- Bottom sheet modal for ingredient browsing
- AI-powered recipe generation
- Animated user interface with pulse effects and transitions
- Subscription-based model with usage limits

## File Structure
- **@/app/index.tsx** - Main home page with ingredient selection
- **@/components/bottom-sheet-select.tsx** - Ingredient selection modal component

## Technical Implementation Notes
- Uses reducer pattern for ingredient state management
- Implements complex animations with react-native-reanimated
- Minimum 3 ingredients required for recipe generation
- Maximum 10 ingredients allowed per selection