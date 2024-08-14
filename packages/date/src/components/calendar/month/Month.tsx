import React, { type FC } from 'react';
import { StyledMonthName, StyledMotionMonth } from './Month.styles';

const Month: FC = () => (
    <StyledMotionMonth>
        <StyledMonthName>Month</StyledMonthName>
    </StyledMotionMonth>
);

Month.displayName = 'Month';

export default Month;
