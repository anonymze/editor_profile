export interface Recipe {
	presentation: string;
	titleRecipe: string;
	prepTime: string | null;
	cookTime: string | null;
	servings: number;
	ingredients: string[];
	instructions: string[];
	lexicon: {
		term: string;
		definition: string;
	}[];
	footer: string;
}