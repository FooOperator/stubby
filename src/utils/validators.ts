import { MAX_SLUG_LENGTH } from "../db/constants";

const slugInvalidCharacters = /(\s)/;

declare type ConditionsObject = { [key: string]: [condition: boolean, message: string] };

export const isUrlValid = (link: string): string[] => {
    const errorPayload: string[] = [];
    const conditions: ConditionsObject = {
        validUrl: [/^(http|https):\/\/[^ "]+$/.test(link), "Link is not valid"],
    }

    Object.keys(conditions).forEach(key => {
        const condition = conditions[key];
        if (!condition[0]) {
            errorPayload.push(condition[1]);
        }
    });

    return errorPayload;
}

export const isSlugValid = (slug: string): string[] => {
    const errorPayload: string[] = [];

    const conditions: ConditionsObject = {
        nonEmpty: [slug.length > 0, 'Slug cannot be empty'],
        shorterThanMaxLength: [slug.length < MAX_SLUG_LENGTH, 'Slug cannot be longer than ' + MAX_SLUG_LENGTH + ' characters'],
        noInvalidCharacters: [!slugInvalidCharacters.test(slug), 'Slug cannot contain spaces']
    }

    Object.keys(conditions).forEach(key => {
        const condition = conditions[key];
        if (!condition[0]) {
            errorPayload.push(condition[1]);
        }
    });

    return errorPayload;
}