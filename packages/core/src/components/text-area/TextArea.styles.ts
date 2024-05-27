import type { Browser } from 'detect-browser';
import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import type { WithTheme } from '../color-scheme-provider/ColorSchemeProvider';

export const StyledTextArea = styled.div`
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    position: relative;
`;

type StyledTextAreaInputProps = WithTheme<{
    $maxHeight: CSSProperties['maxHeight'];
    $minHeight: CSSProperties['minHeight'];
    $shouldChangeColor: boolean;
    $isOverflowing: boolean;
    $browser: Browser | 'bot' | null | undefined;
}>;

export const StyledTextAreaInput = styled.textarea<StyledTextAreaInputProps>`
    border-radius: 3px;
    border: 1px solid rgba(160, 160, 160, 0.3);
    background-color: ${({ theme, $shouldChangeColor }: StyledTextAreaInputProps) =>
        theme.colorMode === 'classic' || $shouldChangeColor ? theme['000'] : theme['100']};
    color: ${({ theme }: StyledTextAreaInputProps) => theme.text};
    resize: none;
    overflow-y: ${({ $isOverflowing }) => ($isOverflowing ? 'scroll' : 'hidden')};
    max-height: ${({ $maxHeight }: StyledTextAreaInputProps) =>
        typeof $maxHeight === 'number' ? `${$maxHeight}px` : $maxHeight};
    min-height: ${({ $minHeight }: StyledTextAreaInputProps) =>
        typeof $minHeight === 'number' ? `${$minHeight}px` : $minHeight};
    width: 100%;
    padding: 8px 10px;

    // Styles for custom scrollbar
    ${({ $browser, theme }: StyledTextAreaInputProps) =>
        $browser === 'firefox'
            ? css`
                  scrollbar-color: rgba(${theme['text-rgb']}, 0.15) transparent;
                  scrollbar-width: thin;
              `
            : css`
                  &::-webkit-scrollbar {
                      width: 10px;
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
                      background-clip: padding-box;
                      border: solid 3px transparent;
                  }
              `}
`;

export const StyledTextAreaLabelWrapper = styled.label`
    left: 10px;
    top: 12px;
    align-items: baseline;
    display: flex;
    flex: 0 0 auto;
    gap: 4px;
    line-height: 1.3;
    pointer-events: none;
    position: absolute;
    user-select: none;
    width: calc(100% - 20px);
`;

type StyledTextAreaLabelProps = WithTheme<unknown>;

export const StyledTextAreaLabel = styled.label<StyledTextAreaLabelProps>`
    color: rgba(${({ theme }: StyledTextAreaLabelProps) => theme['text-rgb']}, 0.45);
    line-height: 1.3;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
