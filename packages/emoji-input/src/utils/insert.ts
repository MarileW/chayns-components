import {
    findAndSelectText,
    moveSelectionOffset,
    restoreSelection,
    saveSelection,
    setChildIndex,
} from './selection';

interface InsertTextAtCursorPositionOptions {
    editorElement: HTMLDivElement;
    text: string;
    shouldUseSavedSelection?: boolean;
}

/**
 * This function inserts the passed text at the correct position in the editor element. If the
 * element has the focus, the new emoji is inserted at the cursor position. If not, the emoji
 * will be appended to the back of the input field content.
 *
 * In addition, this function also sets the cursor to the correct position when the input field
 * has the focus. For this purpose, the current position of the cursor or a selection is read to
 * calculate the cursor position after inserting the text.
 *
 * @param {Object} options - Object with element and text to insert
 * @param {HTMLDivElement} options.editorElement - Element to insert text into
 * @param {string} options.text - Text to insert into element
 */
export const insertTextAtCursorPosition = ({
    editorElement,
    text,
    shouldUseSavedSelection = false,
}: InsertTextAtCursorPositionOptions) => {
    if (shouldUseSavedSelection) {
        restoreSelection(editorElement);
    }

    const selection = window.getSelection();

    saveSelection(editorElement);

    if (selection?.anchorNode && editorElement.contains(selection.anchorNode)) {
        let range = selection.getRangeAt(0);

        const parts = text.split(/\r\n|\r|\n/);

        const firstPart = parts.shift();

        const textNodes = parts.map((part) => document.createTextNode(part));

        range.deleteContents();

        if (firstPart) {
            if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
                const { nodeValue } = selection.anchorNode;

                if (typeof nodeValue === 'string') {
                    selection.anchorNode.nodeValue =
                        nodeValue.slice(0, range.startOffset) +
                        firstPart +
                        nodeValue.slice(range.startOffset);

                    moveSelectionOffset(firstPart.length);
                }
            } else if (selection.anchorNode === editorElement) {
                const textNode = document.createTextNode(firstPart);

                // Inserts the text node before the node at the anchor offset.
                // If that node doesn't exist, the text node is appended to the editor, as a fallback. I'm not sure if there is any case where this would happen.
                const insertBefore = editorElement.childNodes[selection.anchorOffset];
                if (insertBefore) {
                    insertBefore.before(textNode);
                } else {
                    editorElement.appendChild(textNode);
                }

                const textNodeIndex = Array.from(editorElement.childNodes).indexOf(textNode);

                moveSelectionOffset(firstPart.length);
                setChildIndex(textNodeIndex);
            }
        }

        restoreSelection(editorElement);

        if (textNodes.length > 0) {
            range = selection.getRangeAt(0);

            let brElement = document.createElement('br');

            range.insertNode(brElement);
            range.setEndAfter(brElement);
            range.setStartAfter(brElement);

            textNodes.forEach((textNode, index) => {
                range.insertNode(textNode);
                range.setEndAfter(textNode);
                range.setStartAfter(textNode);

                if (index !== textNodes.length - 1) {
                    brElement = document.createElement('br');

                    range.insertNode(brElement);
                    range.setEndAfter(brElement);
                    range.setStartAfter(brElement);
                }
            });

            range.collapse(false);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    } else {
        // eslint-disable-next-line no-param-reassign
        editorElement.innerText += text;
    }
};

export interface ReplaceTextOptions {
    editorElement: HTMLDivElement;
    searchText: string;
    pasteText: string;
}

export const replaceText = ({ editorElement, searchText, pasteText }: ReplaceTextOptions) => {
    const selection = window.getSelection();

    const rangeToReplace = findAndSelectText({ editorElement, searchText });

    if (rangeToReplace && selection) {
        selection.removeAllRanges();
        selection.addRange(rangeToReplace);

        insertTextAtCursorPosition({ editorElement, text: pasteText });
    }
};
