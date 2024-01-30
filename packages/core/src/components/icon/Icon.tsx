import clsx from 'clsx';
import React, { FC, MouseEventHandler } from 'react';
import { StyledIcon, StyledIconWrapper } from './Icon.styles';
import { getStackSizeFactor } from '../../utils/icon';
import { useTheme } from 'styled-components';

export type IconProps = {
    /**
     * Additional class names for the root element
     */
    className?: string;
    /**
     * The color of the icon
     */
    color?: string;
    /**
     * The FontAwesome or tobit icons to render. Multiple icons are stacked.
     */
    icons: string[];
    /**
     * Disables the icon so that it cannot be clicked anymore
     */
    isDisabled?: boolean;
    /**
     * Function to be executed when the icon was clicked
     */
    onClick?: MouseEventHandler<HTMLSpanElement>;
    /**
     * Function to be executed when the icon was double-clicked
     */
    onDoubleClick?: MouseEventHandler<HTMLSpanElement>;
    /**
     * Function to be executed when a mouse button is pressed on the icon
     */
    onMouseDown?: MouseEventHandler<HTMLSpanElement>;
    /**
     * Size of the icon in pixel
     */
    size?: number;
    /**
     * Stops event propagation on click
     */
    shouldStopPropagation?: boolean;
};

const Icon: FC<IconProps> = ({
    className,
    color,
    icons,
    isDisabled,
    onClick,
    onDoubleClick,
    onMouseDown,
    size = 15,
    shouldStopPropagation,
}) => {
    const handleClick: MouseEventHandler<HTMLSpanElement> = (event) => {
        if (shouldStopPropagation) {
            event.stopPropagation();
        }

        if (typeof onClick === 'function') {
            onClick(event);
        }
    };

    const handleDoubleClick: MouseEventHandler<HTMLSpanElement> = (event) => {
        if (shouldStopPropagation) {
            event.stopPropagation();
        }

        if (typeof onDoubleClick === 'function') {
            onDoubleClick(event);
        }
    };

    const { iconStyle } = useTheme();

    let maxStackSizeFactor = 1;

    icons.forEach((icon) => {
        const stackSizeFactor = getStackSizeFactor(icon);

        if (stackSizeFactor && stackSizeFactor > maxStackSizeFactor) {
            maxStackSizeFactor = stackSizeFactor;
        }
    });

    const shouldUseStackedIcon = icons.length > 1;

    const wrapperClasses = clsx(
        'beta-chayns-icon',
        shouldUseStackedIcon ? 'fa-stack' : '',
        className,
    );

    return (
        <StyledIconWrapper
            className={wrapperClasses}
            isDisabled={isDisabled}
            onClick={typeof onClick === 'function' ? handleClick : undefined}
            onDoubleClick={typeof onDoubleClick === 'function' ? handleDoubleClick : undefined}
            onMouseDown={onMouseDown}
            size={size}
        >
            {icons.map((icon) => {
                const stackSizeFactor = getStackSizeFactor(icon);

                const iconClasses = clsx(`${iconStyle as string} ${icon}`, {
                    'fa-stack-1x': shouldUseStackedIcon && stackSizeFactor === undefined,
                });

                return (
                    <StyledIcon
                        className={iconClasses}
                        color={icon.includes('fa-inverse') ? 'white' : color}
                        fontSize={((stackSizeFactor || 1) / maxStackSizeFactor) * size}
                        isStacked={shouldUseStackedIcon}
                        key={icon}
                        size={size}
                    />
                );
            })}
        </StyledIconWrapper>
    );
};

Icon.displayName = 'Icon';

export default Icon;
