import type { WithTheme } from '@chayns-components/core';
import type { Browser } from 'detect-browser';
import styled, { css } from 'styled-components';

type StyledEmojiPickerEmojisProps = WithTheme<{
    shouldPreventScroll: boolean;
    shouldShowNoContentInfo: boolean;
    browser: Browser | 'bot' | null | undefined;
}>;

export const StyledEmojiPickerEmojis = styled.div<StyledEmojiPickerEmojisProps>`
    display: ${({ shouldShowNoContentInfo }) => (shouldShowNoContentInfo ? 'flex' : 'grid')};
    flex: 1 1 auto;
    grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
    grid-template-rows: min-content;
    overflow-y: ${({ shouldPreventScroll }) => (shouldPreventScroll ? 'hidden' : 'scroll')};
    padding: 5px 0 5px 5px;
    position: relative;
    width: 100%;

    ${({ shouldShowNoContentInfo }) =>
        shouldShowNoContentInfo &&
        css`
            align-items: center;
        `}

    ${({ shouldPreventScroll }) =>
        shouldPreventScroll &&
        css`
            padding-right: 5px;
        `}

        // Styles for custom scrollbar
    ${({ browser, theme }: StyledEmojiPickerEmojisProps) =>
        browser === 'firefox'
            ? css`
                  scrollbar-color: rgba(${theme['text-rgb']}, 0.15) transparent;
                  scrollbar-width: thin;
              `
            : css`
                  &::-webkit-scrollbar {
                      width: 5px;
                  }

                  &::-webkit-scrollbar-track {
                      background-color: transparent;
                  }

                  &::-webkit-scrollbar-button {
                      background-color: transparent;
                      height: 5px;
                  }

                  &::-webkit-scrollbar-thumb {
                      background-color: rgba(${theme['text-rgb']}, 0.15);
                      border-radius: 20px;
                  }
              `}
`;

export const StyledEmojiPickerEmojisNoContentInfo = styled.div`
    font-size: 85%;
    opacity: 0.85;
    padding: 0 12.5%;
    text-align: center;
`;
