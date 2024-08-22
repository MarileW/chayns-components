import { useDevice } from 'chayns-api';
import { format } from 'prettier/standalone';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    CodeHighlighterLanguage,
    CodeHighlighterTheme,
    HighlightedLines,
} from '../../types/codeHighlighter';
import { formatLanguage, getParserForLanguage } from '../../utils/codeHighlighter';
import {
    StyledCodeHighlighter,
    StyledCodeHighlighterFileName,
    StyledCodeHighlighterHeader,
} from './CodeHighlighter.styles';
import CopyToClipboard from './copy-to-clipboard/CopyToClipboard';

export type CodeHighlighterProps = {
    /**
     * The code that should be displayed.
     */
    code: string;
    /**
     * The text that should be displayed after the copy button.
     * If not set, just the button is displayed without text.
     */
    copyButtonText?: string;
    /**
     * The lines of code that should be highlighted.
     * Following lines can be highlighted: added, removed and just marked.
     */
    highlightedLines?: HighlightedLines;
    /**
     * The language of the displayed code.
     */
    language: CodeHighlighterLanguage;
    /**
     * Whether the code should be formatted with prettier.
     */
    shouldFormatCode?: boolean;
    /**
     * Callback-Funktion, die aufgerufen wird, wenn das Formatieren des Codes fehlschlägt.
     */
    onFormatError?: (error: unknown) => void;

    /**
     * Whether the line numbers should be displayed.
     */
    shouldShowLineNumbers?: boolean;
    /**
     * The theme of the code block. Decide between dark and light.
     */
    theme?: CodeHighlighterTheme;
};

const CodeHighlighter: FC<CodeHighlighterProps> = ({
    theme = CodeHighlighterTheme.Dark,
    code,
    copyButtonText,
    language,
    highlightedLines,
    shouldFormatCode = false,
    onFormatError,
    shouldShowLineNumbers = false,
}) => {
    const [width, setWidth] = useState(0);

    const ref = useRef<HTMLDivElement>(null);

    const { browser } = useDevice();

    useEffect(() => {
        if (ref.current) {
            const { children } = ref.current;

            const preElement = Array.from(children).find(
                ({ tagName }) => tagName.toLowerCase() === 'pre',
            );

            if (preElement) {
                setWidth(preElement.scrollWidth);
            }
        }
    }, []);

    // function to style highlighted code
    const lineWrapper = useCallback(
        (lineNumber: number) => {
            let style = {
                backgroundColor: 'none',
                display: 'block',
                borderRadius: '2px',
                width: width - 15,
            };

            if (highlightedLines?.added && highlightedLines.added.includes(lineNumber)) {
                style = { ...style, backgroundColor: '#2EF29930' };
            } else if (highlightedLines?.removed && highlightedLines.removed.includes(lineNumber)) {
                style = { ...style, backgroundColor: '#F22E5B30' };
            } else if (highlightedLines?.marked && highlightedLines.marked.includes(lineNumber)) {
                style = { ...style, backgroundColor: '#cccccc40' };
            }

            return { style };
        },
        [highlightedLines, width],
    );

    const formattedCode = useMemo(() => {
        if (language) {
            const config = getParserForLanguage(language);

            if (shouldFormatCode && config) {
                try {
                    return format(code, config) as unknown as string;
                } catch (error) {
                    if (typeof onFormatError !== 'undefined') onFormatError(error);
                }
            }

            return code;
        }

        return code;
    }, [code, language, shouldFormatCode, onFormatError]);

    return useMemo(
        () => (
            <StyledCodeHighlighter $browser={browser?.name} $codeTheme={theme} ref={ref}>
                <StyledCodeHighlighterHeader $codeTheme={theme}>
                    <StyledCodeHighlighterFileName $codeTheme={theme}>
                        {formatLanguage(language)}
                    </StyledCodeHighlighterFileName>
                    <CopyToClipboard text={code} theme={theme} copyButtonText={copyButtonText} />
                </StyledCodeHighlighterHeader>
                <SyntaxHighlighter
                    language={language ?? ''}
                    showLineNumbers={shouldShowLineNumbers}
                    style={theme === CodeHighlighterTheme.Dark ? oneDark : oneLight}
                    wrapLines
                    lineProps={lineWrapper}
                >
                    {formattedCode}
                </SyntaxHighlighter>
            </StyledCodeHighlighter>
        ),
        [
            browser?.name,
            theme,
            language,
            code,
            copyButtonText,
            shouldShowLineNumbers,
            lineWrapper,
            formattedCode,
        ],
    );
};

CodeHighlighter.displayName = 'CodeHighlighter';

export default CodeHighlighter;
