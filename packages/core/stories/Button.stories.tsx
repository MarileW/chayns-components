import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from '../src/components/button/Button';

export default {
    title: 'Core/Button',
    component: Button,
    args: {
        children: 'Click me!',
        isDisabled: false,
        isSecondary: false,
        shouldStopPropagation: false,
    },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = ({ children, ...args }) => (
    <Button {...args}>{children}</Button>
);

export const General = Template.bind({});

export const IconButton = Template.bind({});

IconButton.args = {
    icon: 'fa fa-rocket',
};
