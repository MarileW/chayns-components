import { Meta, StoryFn } from '@storybook/react';
import ContentCard from '../src/components/content-card/ContentCard';
import React from 'react';

export default {
    title: 'Core/ContentCard',
    component: ContentCard,
    args: {
        children:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    },
} as Meta<typeof ContentCard>;

const Template: StoryFn<typeof ContentCard> = ({ children, ...args }) => (
    <ContentCard {...args}>{children}</ContentCard>
);

export const General = Template.bind({});
