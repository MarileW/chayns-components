import React, { type CSSProperties, FC } from 'react';
import { StyledCategory } from './Category.styles';

export type CategoryProps = {
    color: CSSProperties['color'];
};

const Category: FC<CategoryProps> = ({ color }) => {
    const test = '';

    return <StyledCategory color={color} />;
};

Category.displayName = 'Category';

export default Category;
