import styled, { keyframes } from 'styled-components';
import type { WithTheme } from '../color-scheme-provider/ColorSchemeProvider';
import type {
    SmallWaitCursorProps,
    SmallWaitCursorSize,
    SmallWaitCursorSpeed,
} from './SmallWaitCursor';
import {} from './SmallWaitCursor';

type StyledSmallWaitCursorProps = WithTheme<{
    shouldShowWaitCursor: boolean;
    size: SmallWaitCursorSize;
}>;

export const StyledSmallWaitCursor = styled.div<StyledSmallWaitCursorProps>`
    position: relative;
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    opacity: ${({ shouldShowWaitCursor }) => (shouldShowWaitCursor ? 1 : 0)};
`;

type StyledSmallWaitCursorBackgroundProps = WithTheme<unknown>;

export const StyledSmallWaitCursorBackground = styled.div<StyledSmallWaitCursorBackgroundProps>`
    background-color: ${({ theme }: StyledSmallWaitCursorBackgroundProps) => theme['100']};
    border-radius: 50%;
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 1;
`;

type StyledSmallWaitCursorWaitCursorProps = WithTheme<{
    color: SmallWaitCursorProps['color'];
    shouldHideBackground: SmallWaitCursorProps['shouldHideBackground'];
    size: SmallWaitCursorSize;
    speed: SmallWaitCursorSpeed;
}>;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const StyledSmallWaitCursorWaitCursor = styled.div<StyledSmallWaitCursorWaitCursorProps>`
    position: absolute;
    top: ${({ shouldHideBackground }) => (shouldHideBackground ? 0 : 5)}px;
    left: ${({ shouldHideBackground }) => (shouldHideBackground ? 0 : 5)}px;
    z-index: 2;
    border-style: solid;
    border-width: 3px;
    border-color: ${({ color, theme }: StyledSmallWaitCursorWaitCursorProps) =>
        color ?? theme.headline};
    height: ${({ shouldHideBackground, size }) =>
        shouldHideBackground ? '100%' : `${size - 10}px`};
    width: ${({ shouldHideBackground, size }) =>
        shouldHideBackground ? '100%' : `${size - 10}px`};
    border-radius: 50%;
    display: inline-block;
    border-top: 3px solid transparent;

    animation: ${spin} ${({ speed }) => speed}s linear infinite;
`;
