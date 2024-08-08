import type { Locale } from 'date-fns';
import type { MotionProps } from 'framer-motion';
import React, { FC, useEffect, useMemo, useState, type ReactElement } from 'react';
import type { Categories, HighlightedDates } from '../../../types/OLD_calendar';
import { getMonthAndYear, getNewDate } from '../../../utils/OLD_calendar';
import Month from './month/Month';
import { StyledMonthWrapper, StyledMotionWrapper } from './MonthWrapper.styles';

export type MonthWrapperProps = {
    locale: Locale;
    highlightedDates?: HighlightedDates[];
    onSelect: (date: Date) => void;
    selectedDate?: Date;
    categories?: Categories[];
    currentDate: Date;
    direction?: 'left' | 'right';
    onAnimationFinished: () => void;
    shouldRenderTwo: boolean;
    width: number;
    isDisabled?: boolean;
};

const MonthWrapper: FC<MonthWrapperProps> = ({
    locale,
    currentDate,
    highlightedDates,
    selectedDate,
    onSelect,
    categories,
    direction,
    onAnimationFinished,
    shouldRenderTwo,
    width,
    isDisabled,
}) => {
    const [content, setContent] = useState<ReactElement[]>();
    const [prevSelectedDate, setPrevSelectedDate] = useState<Date>();

    const monthHeight = useMemo(() => width / (shouldRenderTwo ? 2 : 1), [width, shouldRenderTwo]);

    useEffect(() => {
        setContent(undefined);
    }, [monthHeight]);

    useEffect(() => {
        if (prevSelectedDate !== selectedDate) {
            setPrevSelectedDate(selectedDate);
        }
    }, [prevSelectedDate, selectedDate]);

    useEffect(() => {
        setContent((prevState) => {
            // Initial render of months
            if (!prevState) {
                const items: ReactElement[] = [];

                for (let i = -1; i < 3; i++) {
                    const date = getNewDate(i, currentDate);

                    const { month, year } = getMonthAndYear(date);

                    items.push(
                        <Month
                            height={monthHeight}
                            key={`${month}-${year}`}
                            month={month}
                            year={year}
                            locale={locale}
                            onSelect={onSelect}
                            highlightedDates={highlightedDates}
                            categories={categories}
                            selectedDate={selectedDate}
                        />,
                    );
                }

                return items;
            }

            if (direction === 'left') {
                const date = getNewDate(-1, currentDate);

                const { month, year } = getMonthAndYear(date);

                prevState.unshift(
                    <Month
                        height={monthHeight}
                        key={`${month}-${year}`}
                        month={month}
                        year={year}
                        locale={locale}
                        onSelect={onSelect}
                        highlightedDates={highlightedDates}
                        categories={categories}
                        selectedDate={selectedDate}
                    />,
                );
                prevState.pop();
            }

            if (direction === 'right') {
                const date = getNewDate(2, currentDate);

                const { month, year } = getMonthAndYear(date);

                prevState.push(
                    <Month
                        height={monthHeight}
                        key={`${month}-${year}`}
                        month={month}
                        year={year}
                        locale={locale}
                        onSelect={onSelect}
                        highlightedDates={highlightedDates}
                        categories={categories}
                        selectedDate={selectedDate}
                    />,
                );
                prevState.shift();
            }

            return prevState;
        });
    }, [
        categories,
        currentDate,
        direction,
        highlightedDates,
        locale,
        monthHeight,
        onSelect,
        prevSelectedDate,
        selectedDate,
    ]);

    useEffect(() => {
        if (selectedDate) {
            setContent((prevState) =>
                (prevState ?? []).map((element) => ({
                    ...element,
                    props: { ...element.props, selectedDate } as ReactElement,
                })),
            );
        }
    }, [selectedDate]);

    const animate: MotionProps['animate'] = useMemo(() => {
        if (shouldRenderTwo) {
            switch (true) {
                case direction === 'left':
                    return { x: '0%' };
                case direction === 'right':
                    return { x: '-100%' };
                default:
                    return { x: '-50%' };
            }
        } else {
            switch (true) {
                case direction === 'left':
                    return { x: '0%' };
                case direction === 'right':
                    return { x: '-200%' };
                default:
                    return { x: '-100%' };
            }
        }
    }, [direction, shouldRenderTwo]);

    return (
        <StyledMonthWrapper $height={monthHeight} $width={width}>
            <StyledMotionWrapper
                animate={animate}
                $isDisabled={isDisabled}
                transition={{
                    type: 'tween',
                    duration: !direction ? 0 : 0.2,
                }}
                onAnimationComplete={onAnimationFinished}
            >
                {content}
            </StyledMotionWrapper>
        </StyledMonthWrapper>
    );
};

MonthWrapper.displayName = 'MonthWrapper';

export default MonthWrapper;
