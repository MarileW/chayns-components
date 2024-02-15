import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import type {
    FramerMotionBugFix,
    WithTheme,
} from '../../color-scheme-provider/ColorSchemeProvider';

type StyledMotionAccordionHeadProps = WithTheme<unknown>;

export const StyledMotionAccordionHead = styled(motion.div)<StyledMotionAccordionHeadProps>`
    align-items: center;
    color: ${({ theme }: StyledMotionAccordionHeadProps) => theme.text};
    display: flex;
    overflow: hidden;
    padding: 4px 0;
`;

export const StyledMotionIconWrapper = styled(motion.div)<FramerMotionBugFix>`
    align-items: center;
    cursor: ${({ onClick }) => (typeof onClick === 'function' ? 'pointer' : 'default')};
    display: flex;
    flex: 0 0 auto;
    height: 25px;
    justify-content: center;
    width: 25px;
`;

type StyledAccordionIconProps = WithTheme<{ $icon: string }>;

export const StyledAccordionIcon = styled.i<StyledAccordionIconProps>`
    align-items: center;
    justify-content: center;
    display: flex;
    color: ${({ theme }: StyledAccordionIconProps) => theme.headline};

    &:before {
        content: ${({ $icon }) => `"\\${$icon}"`};
        font-family: 'Font Awesome 6 Pro', Fontawesome !important;
    }
`;

export const StyledMotionContentWrapper = styled(motion.div)<FramerMotionBugFix>`
    align-self: flex-start;
    cursor: ${({ onClick }) => (typeof onClick === 'function' ? 'pointer' : 'default')};
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    overflow: hidden;
    margin-right: 10px;
`;

export const StyledMotionTitleWrapper = styled(motion.div)<FramerMotionBugFix>`
    display: grid;
    flex: 0 1 auto;
    grid-template-areas: 'header';
`;

interface StyledMotionTitleProps {
    $isOpen: boolean;
    $isWrapped: boolean;
}

export const StyledMotionTitle = styled(motion.div)<StyledMotionTitleProps>`
    font-size: ${({ $isOpen, $isWrapped }) => ($isOpen && !$isWrapped ? '1.3rem' : undefined)};
    font-weight: ${({ $isOpen, $isWrapped }) => ($isOpen && $isWrapped ? 700 : 'normal')};
    grid-area: header;
    height: ${({ $isWrapped }) => ($isWrapped ? '100%' : undefined)};
    overflow: hidden;
    text-overflow: ellipsis;
    transform-origin: top left;
    user-select: none;
    white-space: ${({ $isOpen, $isWrapped }) => ($isOpen && !$isWrapped ? 'normal' : 'nowrap')};

    ${({ $isWrapped }) =>
        $isWrapped &&
        css`
            align-items: center;
            display: flex;
        `}
`;

export const StyledMotionTitleElementWrapper = styled(motion.div)<FramerMotionBugFix>`
    align-items: center;
    display: flex;
    margin-left: 8px;
`;

export const StyledRightWrapper = styled.div`
    display: grid;
    flex: 0 0 auto;
    grid-template-areas: 'right';
    margin-right: 5px;
    overflow: hidden;
    position: relative;
`;

export const StyledMotionRightElementWrapper = styled(motion.div)<FramerMotionBugFix>`
    align-items: center;
    display: flex;
    grid-area: header;
    justify-content: flex-end;
`;

type StyledMotionRightInputProps = WithTheme<{
    $hasIcon: boolean;
}>;

export const StyledMotionRightInput = styled(motion.input)<StyledMotionRightInputProps>`
    background-color: transparent;
    border: 1px solid transparent;
    border-bottom-color: rgba(
        ${({ theme }: StyledMotionRightInputProps) => theme['headline-rgb']},
        0.45
    );
    color: ${({ theme }: StyledMotionRightInputProps) => theme.text};
    grid-area: header;
    padding: ${({ $hasIcon }) => ($hasIcon ? '5px 23px 5px 1px' : '5px 1px')};
`;

export const StyledMotionRightInputIconWrapper = styled(motion.div)<FramerMotionBugFix>`
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    position: absolute;
    right: 4px;
    top: 0;
`;
