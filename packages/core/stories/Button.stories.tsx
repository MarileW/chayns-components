import { ComponentMeta, ComponentStory } from '@storybook/react';

import Button from '../src/components/button/Button';

export default {
    title: 'Core/Button',
    component: Button,
    args: {
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

export const ButtonWithIcon = Template.bind({});

General.args = {
    children: 'Click me!',
};

IconButton.args = {
    icon: 'fa fa-rocket',
};

ButtonWithIcon.args = {
    icon: 'fa fa-rocket',
    children: 'Click me!',
};
