import { StyleSheet, Text, View } from 'react-native';
import React from 'react';


// Define the recipe data structure
export interface RecipeData {
  title: string;
  prepTime?: string | null;
  cookTime?: string | null;
  servings: number;
  ingredients: string[];
  instructions: string[];
  lexicon: {
    term: string;
    definition: string;
  }[];
  footer: string;
}

interface RecipeDisplayProps {
  recipe: RecipeData;
}

/**
 * Component that displays structured recipe data
 */
export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  if (!recipe) return null;

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      
      {/* Prep & Cook Time */}
      <View style={styles.timeContainer}>
        {recipe.prepTime && (
          <View style={styles.timeItem}>
            <Text style={styles.timeIcon}>⏱️</Text>
            <Text style={styles.timeLabel}>Temps de préparation :</Text>
            <Text style={styles.timeValue}>{recipe.prepTime}</Text>
          </View>
        )}
        
        {recipe.cookTime && (
          <View style={styles.timeItem}>
            <Text style={styles.timeIcon}>🔥</Text>
            <Text style={styles.timeLabel}>Temps de cuisson :</Text>
            <Text style={styles.timeValue}>{recipe.cookTime}</Text>
          </View>
        )}
      </View>

      {/* Servings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionIcon}>👥</Text>
        <Text style={styles.sectionLabel}>Nombre de personnes :</Text>
        <Text style={styles.sectionContent}>{recipe.servings}</Text>
      </View>

      {/* Ingredients */}
      {recipe.ingredients.length > 0 && (
        <>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionIcon}>📝</Text>
            <Text style={styles.sectionLabel}>Ingrédients :</Text>
          </View>
          <View style={styles.listContainer}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={`ingredient-${index}`} style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Instructions */}
      {recipe.instructions.length > 0 && (
        <>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionIcon}>📋</Text>
            <Text style={styles.sectionLabel}>Instructions :</Text>
          </View>
          <View style={styles.listContainer}>
            {recipe.instructions.map((instruction, index) => (
              <View key={`instruction-${index}`} style={styles.listItem}>
                <Text style={styles.listNumber}>{index + 1}.</Text>
                <Text style={styles.listText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Lexicon */}
      {recipe.lexicon.length > 0 && (
        <>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionIcon}>📚</Text>
            <Text style={styles.sectionLabel}>Lexique des termes techniques :</Text>
          </View>
          <View style={styles.listContainer}>
            {recipe.lexicon.map((item, index) => (
              <View key={`lexicon-${index}`} style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>
                  <Text style={styles.termText}>{item.term} : </Text>
                  {item.definition}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Footer */}
      {recipe.footer && (
        <Text style={styles.footer}>{recipe.footer}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeContainer: {
    marginBottom: 15,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
  },
  timeValue: {
    fontSize: 16,
    color: '#000',
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
  },
  sectionContent: {
    fontSize: 18,
    color: '#000',
  },
  listContainer: {
    marginLeft: 10,
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  listBullet: {
    fontSize: 18,
    color: '#000',
    marginRight: 10,
    width: 15,
  },
  listNumber: {
    fontSize: 18,
    color: '#000',
    marginRight: 10,
    width: 20,
  },
  listText: {
    fontSize: 18,
    color: '#000',
    flex: 1,
    lineHeight: 26,
  },
  termText: {
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 18,
    color: '#000',
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 