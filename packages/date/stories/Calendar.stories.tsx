import { Meta, StoryFn } from '@storybook/react';
import { addMonths, subMonths } from 'date-fns';
import Calendar, { CalendarSelectionType } from '../src/components/calendar/Calendar';

export default {
    args: {},
    component: Calendar,
    title: 'Date/Calendar',
} as Meta<typeof Calendar>;

const Template: StoryFn<typeof Calendar> = ({ ...args }) => <Calendar {...args} />;

export const General = Template.bind({});

export const SingleSelection = Template.bind({});

SingleSelection.args = {
    maxDate: addMonths(new Date(), 3),
    minDate: subMonths(new Date(), -3),
    selectionType: CalendarSelectionType.Single,
};

export const PeriodSelection = Template.bind({});

PeriodSelection.args = {
    maxDate: addMonths(new Date(), 3),
    minDate: subMonths(new Date(), -3),
    selectionType: CalendarSelectionType.Period,
};
