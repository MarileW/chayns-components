/**
 * @component
 */

import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import './animation-wrapper.scss';

/**
 * The AnimationWrapper provides an eye-catching initial animation to its
 * children.
 */
const AnimationWrapper = ({
    children = <div />,
    animationTime = 0.2,
    setAutoTime = 400,
}) => {
    const [height, setHeight] = useState(0);
    const childrenRef = useRef(0);

    useEffect(() => {
        const item = document.getElementById('animated__content');
        const styles = getComputedStyle(item);
        const itemMargin =
            parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10);
        const itemHeight = item.offsetHeight + itemMargin;

        const [element] = Array.from(childrenRef.current.children);

        const childrenMargin = parseInt(
            window.getComputedStyle(element).marginTop,
            10
        );
        setHeight(itemHeight + childrenMargin);

        const timeout = setTimeout(() => {
            item.parentElement.style.height = `${
                itemHeight + childrenMargin
            }px`;
            item.parentElement.style.opacity = '1';

            setTimeout(
                () => {
                    item.parentElement.style.height = 'auto';
                },
                setAutoTime || itemHeight
                    ? ((itemHeight + childrenMargin) / 5) * 200
                    : 400
            );
        }, 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className="animation__wrapper"
            style={{
                transition: `height ${
                    animationTime || (height / 40) * 0.2
                }s, opacity ${animationTime || (height / 40) * 0.3}s `,
            }}
        >
            <div ref={childrenRef} id="animated__content">
                {children}
            </div>
        </div>
    );
};

AnimationWrapper.propTypes = {
    /**
     * The children that should be animated.
     */
    children: PropTypes.node,

    /**
     * The duration of the animation in seconds.
     */
    animationTime: PropTypes.number,

    /**
     * The time until the height of the content is set to auto to reflect
     * changes in children size.
     */
    setAutoTime: PropTypes.number,
};

export default AnimationWrapper;
