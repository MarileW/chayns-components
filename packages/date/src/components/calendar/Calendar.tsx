import React, { createContext, useMemo, useRef, useState, type FC } from 'react';
import type { Category, HighlightedDates, Period } from '../../types/calendar';
import { StyledCalendar } from './Calendar.styles';

interface ICalendarContext {
    hoveredDate?: Date;
    selectedDates: Date[];
    setHoveredDate?: (date: Date) => void;
    setSelectedDates?: (dates: Date[]) => void;
}

export const CalendarContext = createContext<ICalendarContext>({ selectedDates: [] });

export enum CalendarSelectionType {
    Single = 'Single',
    Period = 'Period',
}

type BaseCalendarProps = {
    /**
     * An array of categories to mark dates with different colors.
     */
    categories?: Category[];
    /**
     * An array with dates and corresponding styles to highlight.
     */
    highlightedDates?: HighlightedDates[];
    /**
     * Whether the calendar is disabled. If true, the user cannot select any date or change the shown month.
     */
    isDisabled?: boolean;
    /**
     * The locale language to format the dates.
     */
    locale?: Locale;
    /**
     * The last date that can be selected. The month of this date will be the last displayed month.
     */
    maxDate?: Date;
    /**
     * The first date that can be selected. The month of this date will be the first displayed month.
     */
    minDate?: Date;
};

type SingleCalendarProps = {
    /**
     * Function to be executed when a date is selected.
     * @param date {Date} - The selected date
     */
    onSelect?: (date: Date) => void;
    /**
     * The selected date.
     */
    selectedDate?: Date;
    /**
     * The selected start date of the period.
     */
    selectedPeriod: never;
    /**
     * The type of selection. The default value is `CalendarSelectionType.Single`.
     */
    selectionType?: CalendarSelectionType.Single;
};

type PeriodCalendarProps = {
    /**
     * Function to be executed when a period is selected.
     * @param period {Period} - The selected period
     */
    onSelect?: (period: Period) => void;
    /**
     * The selected start date of the period.
     */
    selectedDate: never;
    /**
     * The selected start date of the period.
     */
    selectedPeriod?: Period;
    /**
     * The type of selection. The default value is `CalendarSelectionType.Single`.
     */
    selectionType?: CalendarSelectionType.Period;
};

export type CalendarProps = BaseCalendarProps & (SingleCalendarProps | PeriodCalendarProps);

const Calendar: FC<CalendarProps> = ({
    categories,
    maxDate,
    minDate,
    highlightedDates,
    isDisabled,
    locale,
    onSelect,
    selectedDate,
    selectedPeriod,
    selectionType = CalendarSelectionType.Single,
}) => {
    const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
        if (selectionType === CalendarSelectionType.Period && selectedPeriod) {
            const state = [selectedPeriod.startDate];

            if (selectedPeriod.endDate) state.push(selectedPeriod.endDate);

            return state;
        }

        if (selectionType === CalendarSelectionType.Single && selectedDate) return [selectedDate];

        return [];
    });

    const [hoveredDate, setHoveredDate] = useState<Date | undefined>();

    const calendarRef = useRef<HTMLDivElement>(null);

    const calendarContextValue: ICalendarContext = useMemo(
        () => ({
            hoveredDate,
            selectedDates,
            setHoveredDate,
            setSelectedDates,
        }),
        [hoveredDate, selectedDates],
    );

    return (
        <StyledCalendar ref={calendarRef}>
            <CalendarContext.Provider value={calendarContextValue}>
                Kalender
            </CalendarContext.Provider>
        </StyledCalendar>
    );
};

Calendar.displayName = 'Calendar';

export default Calendar;
