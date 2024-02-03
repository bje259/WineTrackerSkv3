export interface WineData {
  wineFacts: Record<string, any>;
  wineryRating: number;
  foodPairings: string[];
  style: string;
  varietal: string;
  style_stats: {
    description: string;
    interestingFacts: string;
    bodyRating: number;
    bodyDesc: string;
    acidityRating: number;
    acidityDesc: string;
    BaseStats: Record<string, number>;
  };
  recommended_vintages: { year: number; type: string }[] | string;
  image: string;
}

export interface WineInfo {
  wineFacts: WineFacts;
  wineryRating: number;
  foodPairings: string[];
  style: string;
  varietal: string;
  stylestats: Stylestats;
  recommended_vintages: Recommendedvintage[] | Recommendedvintage | string;
  image: string;
}

export interface Recommendedvintage {
  year: number;
  type: string;
}

export interface Stylestats {
  Description: string;
  "Interesting Facts": string[] | string;
  "Body Rating": number;
  "Body Description": string;
  "Acidity Rating": number;
  "Acidity Description": string;
  BaseStats: BaseStats;
}

export interface BaseStats {
  acidity?: number;
  fizziness?: number;
  intensity?: number;
  sweetness?: number;
  tannin?: number;
  Error?: string;
}

export interface WineFacts {
  "Wine Name"?: string;
  Winery?: string;
  Grapes?: string;
  Region?: string;
  "Wine style"?: string;
  Allergens?: string;
  "Alcohol content"?: string;
  "Wine description"?: string;
  data?: string;
}

export interface WineFlatData {
  "wineFacts.Wine Name"?: string;
  "wineFacts.Winery"?: string;
  "wineFacts.Grapes"?: string;
  "wineFacts.Region"?: string;
  "wineFacts.Wine style"?: string;
  "wineFacts.Allergens"?: string;
  wineryRating: number;
  "foodPairings.0": string;
  "foodPairings.1"?: string;
  "foodPairings.2"?: string;
  style: string;
  varietal: string;
  "style_stats.Description": string;
  "style_stats.Interesting Facts"?: string;
  "style_stats.Body Rating": number;
  "style_stats.Body Description": string;
  "style_stats.Acidity Rating": number;
  "style_stats.Acidity Description": string;
  "style_stats.BaseStats.acidity"?: number;
  "style_stats.BaseStats.fizziness"?: any;
  "style_stats.BaseStats.intensity"?: number;
  "style_stats.BaseStats.sweetness"?: number;
  "style_stats.BaseStats.tannin"?: number;
  "recommended_vintages.0.year"?: number;
  "recommended_vintages.0.type"?: string;
  "recommended_vintages.1.year"?: number;
  "recommended_vintages.1.type"?: string;
  image: string;
  "wineFacts.Alcohol content"?: string;
  "foodPairings.3"?: string;
  "style_stats.Interesting Facts.0"?: string;
  "recommended_vintages.2.year"?: number;
  "recommended_vintages.2.type"?: string;
  "recommended_vintages.3.year"?: number;
  "recommended_vintages.3.type"?: string;
  "wineFacts.Wine description"?: string;
  "style_stats.Interesting Facts.1"?: string;
  "style_stats.Interesting Facts.2"?: string;
  recommended_vintages?: string;
  "foodPairings.4"?: string;
  "style_stats.Interesting Facts.3"?: string;
  "style_stats.Interesting Facts.4"?: string;
  "recommended_vintages.4.year"?: number;
  "recommended_vintages.4.type"?: string;
  "recommended_vintages.5.year"?: number;
  "recommended_vintages.5.type"?: string;
  "wineFacts.data"?: string;
  "style_stats.BaseStats.Error"?: string;
  "recommended_vintages.year"?: number;
  "recommended_vintages.type"?: string;
  "recommended_vintages.6.year"?: number;
  "recommended_vintages.6.type"?: string;
  "recommended_vintages.7.year"?: number;
  "recommended_vintages.7.type"?: string;
}
