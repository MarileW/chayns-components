import React, { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { renderToString } from 'react-dom/server';
import {
    StyledTypewriter,
    StyledTypewriterPseudoText,
    StyledTypewriterText,
} from './Typewriter.styles';
import { getCharactersCount, getSubTextFromHTML } from './utils';

export enum TypewriterResetDelay {
    Slow = 3000,
    Medium = 1500,
    Fast = 750,
}

export enum TypewriterSpeed {
    Slow = 40,
    Medium = 30,
    Fast = 20,
}

export type TypewriterProps = {
    /**
     * The text to type
     */
    children: ReactElement | ReactElement[] | string | string[];
    /**
     * Waiting time before the typewriter resets the content if multiple texts are given
     */
    resetDelay?: TypewriterResetDelay;
    /**
     * The speed of the animation. Use the TypewriterSpeed enum for this prop.
     */
    speed?: TypewriterSpeed;
};

const Typewriter: FC<TypewriterProps> = ({
    children,
    resetDelay = TypewriterResetDelay.Medium,
    speed = TypewriterSpeed.Medium,
}) => {
    const [currentChildrenIndex, setCurrentChildrenIndex] = useState(0);

    const areMultipleChildrenGiven = Array.isArray(children);
    const childrenCount = areMultipleChildrenGiven ? children.length : 1;

    const textContent = useMemo(() => {
        if (areMultipleChildrenGiven) {
            const currentChildren = children[currentChildrenIndex];

            if (currentChildren) {
                return React.isValidElement(currentChildren)
                    ? renderToString(currentChildren)
                    : currentChildren;
            }

            return '';
        }

        return React.isValidElement(children) ? renderToString(children) : children;
    }, [areMultipleChildrenGiven, children, currentChildrenIndex]);

    const charactersCount = useMemo(() => getCharactersCount(textContent), [textContent]);

    const [isResetAnimationActive, setIsResetAnimationActive] = useState(false);
    const [shownCharCount, setShownCharCount] = useState(
        charactersCount > 0 ? 0 : textContent.length
    );
    const [shouldStopAnimation, setShouldStopAnimation] = useState(false);

    const isAnimatingText = shownCharCount !== textContent.length || areMultipleChildrenGiven;

    const handleClick = useCallback(() => {
        setShouldStopAnimation(true);
    }, []);

    useEffect(() => {
        let interval: number | undefined;

        if (shouldStopAnimation || charactersCount === 0) {
            setShownCharCount(textContent.length);
        } else if (isResetAnimationActive) {
            interval = window.setInterval(() => {
                setShownCharCount((prevState) => {
                    const nextState = prevState - 1;

                    if (nextState === 0) {
                        window.clearInterval(interval);

                        if (areMultipleChildrenGiven) {
                            setTimeout(() => {
                                setIsResetAnimationActive(false);
                                setCurrentChildrenIndex((currentIndex) => {
                                    let newIndex = currentIndex + 1;

                                    if (newIndex > childrenCount - 1) {
                                        newIndex = 0;
                                    }

                                    return newIndex;
                                });
                            }, resetDelay);
                        }
                    }

                    return nextState;
                });
            }, speed);
        } else {
            interval = window.setInterval(() => {
                setShownCharCount((prevState) => {
                    let nextState = prevState + 1;

                    if (nextState === charactersCount) {
                        window.clearInterval(interval);

                        /**
                         * At this point, the next value for "shownCharCount" is deliberately set to
                         * the length of the textContent in order to correctly display HTML elements
                         * after the last letter.
                         */
                        nextState = textContent.length;

                        if (areMultipleChildrenGiven) {
                            setTimeout(setIsResetAnimationActive, resetDelay, true);
                        }
                    }

                    return nextState;
                });
            }, speed);
        }

        return () => {
            window.clearInterval(interval);
        };
    }, [
        shouldStopAnimation,
        speed,
        textContent.length,
        charactersCount,
        isResetAnimationActive,
        areMultipleChildrenGiven,
        resetDelay,
        childrenCount,
    ]);

    useEffect(() => {
        if (charactersCount) {
            setIsResetAnimationActive(false);
            setShownCharCount(0);
        }
    }, [charactersCount]);

    const shownText = useMemo(
        () => getSubTextFromHTML(textContent, shownCharCount),
        [shownCharCount, textContent]
    );

    return (
        <StyledTypewriter onClick={handleClick}>
            {isAnimatingText ? (
                <StyledTypewriterText
                    dangerouslySetInnerHTML={{ __html: shownText }}
                    isAnimatingText
                />
            ) : (
                <StyledTypewriterText>{children}</StyledTypewriterText>
            )}
            {isAnimatingText && (
                <StyledTypewriterPseudoText dangerouslySetInnerHTML={{ __html: textContent }} />
            )}
        </StyledTypewriter>
    );
};

Typewriter.displayName = 'Typewriter';

export default Typewriter;
