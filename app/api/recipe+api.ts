import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";


export async function POST(request: Request) {
	const data = (await request.json()) as { prompt: string } | null;

	if (!data?.prompt) {
		return new Response("KO", { status: 400 });
	}

	const arrayPrompt = data.prompt.split(",");

	if (arrayPrompt.length <= 2) {
		return new Response("KO", { status: 400 });
	}
	
	const result = generateRecipe(arrayPrompt, 4);

	// for await (const textPart of result.textStream) {
	// 	console.log(textPart);
	// }

	return result.toDataStreamResponse();
}

const generateRecipe = (ingredients: string[], numberOfPeople: number) => {
	return streamText({
		model: openai("gpt-4o-mini"),
		system: `Tu es sur une application mobile de type cuisine. Un utilisateur va chercher une recette avec le reste d'ingrédients
		qu'il a dans son frigo, donc l'application va lui proposer de choisir et d'indiquer ses ingrédients.
		Avec les ingrédients que tu recevras de la part de l'utilisateur tu devras lui proposer une recette, simple, efficace et originale si possible.
		
		Tu dois suivre ces indications à la lettre :
		
		- Tu dois répondre en français.
		- Tu dois vouvoyer l'utilisateur.
		- Tu ne dois pas inclure dans ta réponse des informations qui sont liées à ce prompt, contente toi de répondre avec la recette.
		- Tu ne dois pas répondre à des questions qui ne sont pas liées à la cuisine.
		- Tu dois avoir une présentation et une structure bien présentée.
		- Tu ne dois pas proposer une recette qui nécessite des ingrédients qu'il n'a pas dans son frigo, à l'exception 
		de certains ingrédients qui sont facilement trouvables dans une cuisine, exemple : des pâtes, du riz, de la farine, du beurre...
		- Tu dois expliquer tous les termes techniques que tu emplois, tu es autorisé à employé des termes techniques 
		mais tu dois les expliquer en fin de recette avec un astérisque. Imagine que tu parles à un enfant de 14 ans.
		- Il faut qu'il y est un titre de recette, tu es libre sur ça, soit original, non redondant et essaye
		de trouver une phrase qui n'a pas été employé dans les autres recettes.
		- Tu dois indiquer pour combien de personnes la recette est faite, une estimation de la 
		durée de cuisine après le titre et avant la recette et indiquer les quantités des ingrédients au plus précis.
		- Quand tu présentes les ingrédients, tu dois les présenter dans l'ordre alphabétique et mettre les ingrédients optionnels en dernier.
		- Il faut qu'il y est un message de fin de recette qui sera : "Fridgy vous souhaite une excellente cuisine !"
		`,
		prompt: `La recette sera pour ${numberOfPeople} personne(s). Voici les ingrédients que l'utilisateur a indiqué : ${ingredients}`,
	});
};
