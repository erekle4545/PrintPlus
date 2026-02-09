export const languages = ['ka', 'en', 'ru'] as const;
export const defaultLanguage = 'ka';

export type Language = typeof languages[number];

export function isValidLanguage(lang: string): lang is Language {
    return languages.includes(lang as Language);
}