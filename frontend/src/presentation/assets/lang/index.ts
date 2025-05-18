import ro from "./ro";
import en from "./en";

export enum SupportedLanguage {
  EN = "en",
  RO = "ro",
}

type NestedRecord = {
  [key: string]: string | NestedRecord;
};

type FlattenedMessages = Record<string, string>;

function flattenMessages(nestedMessages: NestedRecord, prefix = ''): FlattenedMessages {
  return Object.keys(nestedMessages).reduce((messages: FlattenedMessages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

const messages = {
  en,
  ro,
};

/**
 * Add any message IDs in its corresponding JSON file for each language to be used here to replace it with the translation via this function.
 */
export const getMessagesForLanguage = (language: SupportedLanguage): FlattenedMessages =>
  flattenMessages(messages[language]);
