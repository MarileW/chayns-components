import styled, { css } from 'styled-components';
import type { WithTheme } from '../../color-scheme-provider/ColorSchemeProvider';

type StyledAccordionContentProps = WithTheme<{
    $isWrapped: boolean;
    $maxHeight?: number;
}>;

export const StyledAccordionContent = styled.div<StyledAccordionContentProps>`
    color: ${({ theme }: StyledAccordionContentProps) => theme.text};
    padding: ${({ $isWrapped }) => ($isWrapped ? '0 9px 18px 26px' : '0 9px 9px 10px')};

    ${({ $maxHeight }) =>
        typeof $maxHeight === 'number' &&
        css`
            max-height: ${$maxHeight}px;
            overflow-y: scroll;
        `}
`;
