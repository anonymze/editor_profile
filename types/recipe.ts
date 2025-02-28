export interface Recipe {
	presentation: string;
	titleRecipe: string;
	type: "starter" | "main" | "dessert";
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