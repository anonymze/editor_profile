import ingredient from "@/data/ingredient";
import vegetables from "@/data/vegetable";
import cheese from "@/data/cheese";
import fruits from "@/data/fruit";
import pasta from "@/data/pasta";
import dough from "@/data/dough";
import dairy from "@/data/dairy";
import rice from "@/data/rice";
import meat from "@/data/meat";
import fish from "@/data/fish";

export const initialSections = [
  {
    title: "Fromages",
    data: cheese,
  },
  {
    title: "Fruits",
    data: fruits,
  },
  {
    title: "Ingrédients",
    data: ingredient,
  },
  {
    title: "Légumes",
    data: vegetables,
  },
  {
    title: "Pâtes",
    data: pasta,
  },
  {
    title: "Pâtes préparées",
    data: dough,
  },
  {
    title: "Produits laitiers",
    data: dairy,
  },
  {
    title: "Poissons",
    data: fish,
  },
  {
    title: "Riz",
    data: rice,
  },
  {
    title: "Viandes",
    data: meat,
  },
];
