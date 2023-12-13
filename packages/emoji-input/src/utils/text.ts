import { BB_LC_MENTION_REGEX, HTML_LC_MENTION_REGEX } from '../constants/regex';
import { escapeHTML, unescapeHTML } from './emoji';

export const convertTextToHTML = (text: string) => {
    const element = document.createElement('div');

    element.style.position = 'absolute';
    element.style.opacity = '0';

    element.contentEditable = 'true';
    element.innerText = text;

    document.body.appendChild(element);

    let result = element.innerHTML;

    document.body.removeChild(element);

    result = unescapeHTML(result);

    result = result.replace(
        BB_LC_MENTION_REGEX,
        '<lc_mention contenteditable="false" id="$1"><span>@</span>$2</lc_mention>',
    );

    return result;
};

export const convertHTMLToText = (text: string) => {
    let result = text;

    console.debug('convertHTMLToText 1', text);

    result = result.replace(HTML_LC_MENTION_REGEX, '[lc_mention id="$1"]$2[/lc_mention]');
    // eslint-disable-next-line no-irregular-whitespace
    result = result.replace(/​/g, '');

    result = escapeHTML(result);

    const element = document.createElement('div');

    element.style.position = 'absolute';
    element.style.opacity = '0';

    element.contentEditable = 'true';
    element.innerHTML = result;

    document.body.appendChild(element);

    result = element.innerText;

    document.body.removeChild(element);

    console.debug('convertHTMLToText 2', result);

    return result;
};

export const getElementTextLength = (element: Element) => {
    let textLength = 0;

    try {
        textLength = convertHTMLToText(element.outerHTML).length;
    } catch (e) {
        // Do nothing
    }

    return textLength;
};
