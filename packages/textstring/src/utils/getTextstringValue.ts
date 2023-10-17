import { useContext } from 'react';
import type { ITextstring, TextstringReplacement } from '../components/textstring/types';
import { TextStringContext } from '../components/textstring-provider/TextStringProvider';

export interface GetTextstringValue {
    textString: ITextstring;
    replacements?: TextstringReplacement[];
}

export const useTextstringValue = ({ replacements, textString }: GetTextstringValue) => {
    const textStrings = useContext(TextStringContext);

    const value = textStrings[textString.name] ?? textString.fallback;

    if (!replacements) {
        return value;
    }

    let newValue = value;

    replacements.forEach(({ replacement, key }) => {
        newValue = newValue.replace(key, replacement);
    });

    return newValue;
};
