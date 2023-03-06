import { motion } from 'framer-motion';
import styled from 'styled-components';
import type { WithTheme } from '../color-scheme-provider/ColorSchemeProvider';
import type { InputProps } from './Input';

type StyledInputProps = WithTheme<Pick<InputProps, 'isDisabled'>>;

export const StyledInput = styled.div<StyledInputProps>`
    align-items: center;
    background-color: ${({ theme }: StyledInputProps) => theme['100']};
    border: 1px solid rgba(160, 160, 160, 0.3);
    border-radius: 3px;
    color: ${({ theme }: StyledInputProps) => theme['006']};
    display: flex;
    justify-content: space-between;
    min-height: 42px;
    opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
    padding: 8px 10px;
    transition: opacity 0.3s ease;
    width: 100%;

    &:not(&:first-child) {
        margin-top: 8px;
    }
`;

export const StyledInputContent = styled.div`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    position: relative;
    min-width: 0;
`;

export const StyledInputField = styled.input`
    background: none;
    border: none;
    color: ${({ theme }: StyledInputProps) => theme.text};
    padding: 0;
`;

export const StyledMotionInputLabel = styled(motion.label)`
    line-height: 1.15;
    pointer-events: none;
    position: absolute;
    user-select: none;
`;
