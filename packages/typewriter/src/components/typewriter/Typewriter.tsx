import React, { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { renderToString } from 'react-dom/server';
import {
    StyledTypewriter,
    StyledTypewriterPseudoText,
    StyledTypewriterText,
} from './Typewriter.styles';
import { getCharactersCount, getSubTextFromHTML, shuffleArray } from './utils';

export enum TypewriterResetDelay {
    Slow = 4000,
    Medium = 2000,
    Fast = 1000,
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
     * Specifies whether the children should be sorted randomly if there are multiple texts.
     * This makes the typewriter start with a different text each time and also changes them
     * in a random order.
     */
    shouldSortChildrenRandomly?: boolean;
    /**
     * Specifies whether the reset of the text should be animated with a backspace animation for multiple texts.
     */
    shouldUseResetAnimation?: boolean;
    /**
     * The speed of the animation. Use the TypewriterSpeed enum for this prop.
     */
    speed?: TypewriterSpeed;
};

const Typewriter: FC<TypewriterProps> = ({
    children,
    resetDelay = TypewriterResetDelay.Medium,
    shouldSortChildrenRandomly = false,
    shouldUseResetAnimation = false,
    speed = TypewriterSpeed.Medium,
}) => {
    const [currentChildrenIndex, setCurrentChildrenIndex] = useState(0);

    const sortedChildren = useMemo(
        () =>
            Array.isArray(children) && shouldSortChildrenRandomly
                ? shuffleArray<ReactElement | string>(children)
                : children,
        [children, shouldSortChildrenRandomly]
    );

    const areMultipleChildrenGiven = Array.isArray(sortedChildren);
    const childrenCount = areMultipleChildrenGiven ? sortedChildren.length : 1;

    const textContent = useMemo(() => {
        if (areMultipleChildrenGiven) {
            const currentChildren = sortedChildren[currentChildrenIndex];

            if (currentChildren) {
                return React.isValidElement(currentChildren)
                    ? renderToString(currentChildren)
                    : currentChildren;
            }

            return '';
        }

        return React.isValidElement(sortedChildren)
            ? renderToString(sortedChildren)
            : sortedChildren;
    }, [areMultipleChildrenGiven, currentChildrenIndex, sortedChildren]);

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

    const handleSetNextChildrenIndex = useCallback(
        () =>
            setCurrentChildrenIndex(() => {
                let newIndex = currentChildrenIndex + 1;

                if (newIndex > childrenCount - 1) {
                    newIndex = 0;
                }

                return newIndex;
            }),
        [childrenCount, currentChildrenIndex]
    );

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
                                handleSetNextChildrenIndex();
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
                            setTimeout(() => {
                                if (shouldUseResetAnimation) {
                                    setIsResetAnimationActive(true);
                                } else {
                                    setShownCharCount(0);
                                    setTimeout(handleSetNextChildrenIndex, resetDelay / 2);
                                }
                            }, resetDelay);
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
        handleSetNextChildrenIndex,
        shouldUseResetAnimation,
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
                <StyledTypewriterText>{sortedChildren}</StyledTypewriterText>
            )}
            {isAnimatingText && (
                <StyledTypewriterPseudoText dangerouslySetInnerHTML={{ __html: textContent }} />
            )}
        </StyledTypewriter>
    );
};

Typewriter.displayName = 'Typewriter';

export default Typewriter;
