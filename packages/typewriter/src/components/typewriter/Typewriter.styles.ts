import type { WithTheme } from '@chayns-components/core';
import styled, { css, keyframes } from 'styled-components';

export const StyledTypewriter = styled.div`
    align-items: inherit;
    display: flex;
    position: relative;
    width: 100%;
`;

const blinkAnimation = keyframes`
  100% {
    visibility: hidden;
  }
`;

export const StyledTypewriterPseudoText = styled.span`
    opacity: 0;
    pointer-events: none;
    user-select: none;
`;

type StyledTypewriterTextProps = WithTheme<{
    $isAnimatingText?: boolean;
    $shouldHideCursor?: boolean;
}>;

export const StyledTypewriterText = styled.span<StyledTypewriterTextProps>`
    color: inherit;
    position: ${({ $isAnimatingText }) => ($isAnimatingText ? 'absolute' : 'relative')};
    width: 100%;

    ${({ $isAnimatingText, $shouldHideCursor }) =>
        $isAnimatingText &&
        !$shouldHideCursor &&
        css`
            &:after {
                animation: ${blinkAnimation} 1s steps(5, start) infinite;
                color: ${({ theme }: StyledTypewriterTextProps) => theme.text};
                content: '▋';
                margin-left: 0.25rem;
                opacity: 0.85;
                position: absolute;
                vertical-align: baseline;
            }
        `}
`;
