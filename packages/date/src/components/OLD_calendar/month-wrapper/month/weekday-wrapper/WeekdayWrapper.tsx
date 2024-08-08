import type { Locale } from 'date-fns';
import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import React, { FC, useMemo, type ReactElement } from 'react';
import Weekday from './weekday/Weekday';
import { StyledWeekdayWrapper } from './WeekdayWrapper.styles';

export type WeekdayWrapperProps = {
    locale?: Locale;
};

const WeekdayWrapper: FC<WeekdayWrapperProps> = ({ locale }) => {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const sunday = endOfWeek(new Date(), { weekStartsOn: 1 });
    const weekdays = eachDayOfInterval({ start: monday, end: sunday });

    const weekdayElements = useMemo(() => {
        const items: ReactElement[] = [];

        weekdays.forEach((day) => {
            const formattedDay = format(day, 'EE', { locale });

            items.push(<Weekday key={`weekday-${formattedDay}`} name={formattedDay} />);
        });

        return items;
    }, [locale, weekdays]);

    return <StyledWeekdayWrapper>{weekdayElements}</StyledWeekdayWrapper>;
};

WeekdayWrapper.displayName = 'WeekdayWrapper';

export default WeekdayWrapper;
