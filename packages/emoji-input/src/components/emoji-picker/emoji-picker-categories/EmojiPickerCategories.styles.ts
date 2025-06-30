import { motion } from 'motion/react';
import styled from 'styled-components';
import { getFontFamily } from '../../../utils/font';

export const StyledEmojiPickerCategories = styled.div`
    align-items: center;
    border-top: 1px solid rgba(160, 160, 160, 0.3);
    display: flex;
    flex: 0 0 auto;
    justify-content: space-between;
    padding-top: 10px;
    width: 100%;
`;

export const StyledMotionEmojiPickerCategory = styled(motion.div)`
    cursor: pointer;
    font-family: ${getFontFamily};
    font-size: 20px;
`;
