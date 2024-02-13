import RadioButtonGroup from '@chayns-components/core/lib/components/radio-button/radio-button-group/RadioButtonGroup';
import RadioButton from '@chayns-components/core/lib/components/radio-button/RadioButton';
import { Meta, StoryFn } from '@storybook/react';
import { useMemo, useState } from 'react';
import { TextString, TextStringProvider } from '../src';
import { RadioButtonItem } from '@chayns-components/core/lib/components/radio-button/types';

export default {
    title: 'TextString/TextString',
    component: TextString,
    args: {},
} as Meta<typeof TextString>;

const Template: StoryFn<typeof TextString> = ({ ...args }) => (
    <TextStringProvider language="de" libraryName="chayns.components">
        <TextString {...args} />
    </TextStringProvider>
);

const TextStringWithReplacementTemplate: StoryFn<typeof TextString> = ({ ...args }) => {
    const [food, setFood] = useState('##food##');
    const handleFoodChange = (item: RadioButtonItem) => {
        switch (item.id) {
            case '0':
                setFood('Eis');
                break;
            case '1':
                setFood('Pizza');
                break;
            case '3':
                setFood('Salat');
                break;
            default:
                setFood('Schokolade');
                break;
        }
    };

    return useMemo(() => {
        return (
            <TextStringProvider language="de" libraryName="chayns.components">
                <TextString
                    childrenTagName="h1"
                    textString={{
                        fallback: '##food## ist lecker.',
                        name: 'txt_chayns_chaynsComponents_textString_example_replacement',
                    }}
                    replacements={{ '##food##': food }}
                />
                <i>'##food##' wird durch die ausgewählte Speise ersetzt</i>
                <h2>Speise auswählen</h2>
                <RadioButtonGroup>
                    <RadioButton id="0" label="Eis" onChange={handleFoodChange} />
                    <RadioButton id="1" label="Pizza" onChange={handleFoodChange} />
                    <RadioButton id="2" label="Schokolade" onChange={handleFoodChange} />
                    <RadioButton id="3" label="Salat" onChange={handleFoodChange} />
                </RadioButtonGroup>
            </TextStringProvider>
        );
    }, [food]);
};

export const General = Template.bind({});

export const WithHTML = Template.bind({});

export const TextStringWithReplacement = TextStringWithReplacementTemplate.bind({});

export const TextStringWithStyles = Template.bind({});

WithHTML.args = {
    textString: {
        fallback: '<button>Drücke mich!</button>',
        name: 'txt_chayns_chaynsComponents_textString_example_with_html',
    },
    isTextstringHTML: true,
};

General.args = {
    childrenTagName: 'h1',
    textString: {
        fallback: 'Das ist ein TextString! Pizza ist lecker.',
        name: 'txt_chayns_chaynsComponents_textString_example',
    },
};

TextStringWithStyles.args = {
    childrenTagName: 'h1',
    childrenStyles: { color: 'rebeccapurple' },
    textString: {
        fallback: 'Das ist ein TextString! Pizza ist lecker.',
        name: 'txt_chayns_chaynsComponents_textString_example',
    },
};
