const undefinedToEmptyString = (s: string | undefined) => s ?? '';

export const spacesToUnderscores = (s: string | undefined) =>
  undefinedToEmptyString(s).replace(/\s/g, '_');

export const underscoresToSpaces = (s: string | undefined) =>
  undefinedToEmptyString(s).replace(/_/g, ' ');
