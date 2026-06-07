export type LevelName = "Básico" | "Intermediário" | "Avançado";

/**
 * Uma questão é declarada de forma enxuta: o enunciado, a alternativa correta
 * e exatamente 4 alternativas incorretas. O seeder monta as 5 alternativas
 * finais a partir disso, garantindo por construção a regra de
 * "exatamente 5 alternativas, sendo 1 correta".
 */
export interface SeedQuestion {
    enunciado: string;
    correta: string;
    incorretas: [string, string, string, string];
}

export interface LanguageSeed {
    language: string;
    niveis: Record<LevelName, SeedQuestion[]>;
}

export interface LevelSeed {
    name: LevelName;
    xp: number;
}

export const LEVELS: LevelSeed[] = [
    { name: "Básico", xp: 50 },
    { name: "Intermediário", xp: 75 },
    { name: "Avançado", xp: 100 },
];
