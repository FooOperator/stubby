import { MAX_SLUG_LENGTH } from "../db/constants";

const slugInvalidCharacters = /(\s)/

export const isLinkValid = (link: string): boolean => {
    return /^(http|https):\/\/[^ "]+$/.test(link);
}

export const isSlugValid = (slug: string): boolean => {
    return slug.length > 0 && slug.length < MAX_SLUG_LENGTH && !slugInvalidCharacters.test(slug);
}