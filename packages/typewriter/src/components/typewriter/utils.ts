/**
 * This function extracts a part of the text from an HTML text. The HTML elements themselves are
 * returned in the result. In addition, the function ensures that the closing tag of the Bold HTML
 * element is also returned for text that is cut off in the middle of a Bold element, for example.
 *
 * @param html - The text from which a part should be taken
 * @param length - The length of the text to be extracted
 *
 * @return string - The text part with the specified length - additionally the HTML elements are added
 */
export const getSubTextFromHTML = (html: string, length: number): string => {
    const div = document.createElement('div');

    div.innerHTML = html;

    let text = '';
    let currLength = 0;

    const traverse = (element: Element): boolean => {
        console.debug('TEST', {
            nodeName: element.nodeName,
            nodeType: element.nodeType,
            textContent: element.textContent,
        });

        if (element.nodeName === 'TWIGNORE') {
            text += element.innerHTML;
        } else if (element.nodeType === 3 && typeof element.textContent === 'string') {
            const nodeText = element.textContent;

            if (currLength + nodeText.length <= length) {
                text += nodeText;
                currLength += nodeText.length;
            } else {
                text += nodeText.substring(0, length - currLength);

                return false;
            }
        } else if (element.nodeType === 1) {
            const nodeName = element.nodeName.toLowerCase();

            let attributes = '';

            // @ts-expect-error: Type is correct here
            // eslint-disable-next-line no-restricted-syntax
            for (const attribute of element.attributes) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
                attributes += ` ${attribute.name}="${attribute.value}"`;
            }

            text += `<${nodeName}${attributes}>`;

            for (let i = 0; i < element.childNodes.length; i++) {
                const childNode = element.childNodes[i];

                if (childNode && !traverse(childNode as Element)) {
                    return false;
                }
            }

            text += `</${nodeName}>`;
        }

        return true;
    };

    for (let i = 0; i < div.childNodes.length; i++) {
        const childNode = div.childNodes[i];

        if (childNode && !traverse(childNode as Element)) {
            return text;
        }
    }

    return text;
};

export const getCharactersCount = (html: string): number => {
    const div = document.createElement('div');

    div.innerHTML = html;

    let count = 0;

    const traverse = (node: Node): void => {
        if (node.nodeName === 'TWIGNORE') {
            count += 1;
        } else if (node.nodeType === 3 && typeof node.textContent === 'string') {
            count += node.textContent.trim().length;
        } else if (node.nodeType === 1) {
            if (node.nodeName === 'CODE' && node.textContent !== null) {
                count += node.textContent.length;

                return;
            }

            Array.from(node.childNodes).forEach(traverse);
        }
    };

    Array.from(div.childNodes).forEach(traverse);

    return count;
};

export const shuffleArray = <T>(array: T[]): T[] => {
    const result = Array.from(array);

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] = [result[j]!, result[i]!];
    }

    return result;
};

interface CalculateAutoSpeedProps {
    fullTextLength: number;
    currentPosition: number;
    baseSpeedFactor: number;
}

export const calculateAutoSpeed = ({
    fullTextLength,
    currentPosition,
    baseSpeedFactor,
}: CalculateAutoSpeedProps): { speed: number; steps: number } => {
    const MIN_SPEED = 1;
    const MAX_SPEED = 10;

    const remainingLength = fullTextLength - currentPosition;

    // Calculate the speed with the remaining text length and the baseSpeedFactor
    const speed = Math.min(baseSpeedFactor / remainingLength, MAX_SPEED);

    if (speed < MIN_SPEED) {
        return { speed: 1, steps: 2 };
    }

    return { speed, steps: 1 };
};
