function getLanguageName(languageId: number): string {
  const LANGUAGE_NAMES: Record<number, string> = {
    54: "C++",
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

export { getLanguageName };

export function getLanguageId(language: string): number | undefined {
  const languageMap: Record<string, number> = {
    CPP: 54,
    CPLUSPLUS: 54,
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    TYPESCRIPT: 74,
  };
  return languageMap[language.toUpperCase()];
}
