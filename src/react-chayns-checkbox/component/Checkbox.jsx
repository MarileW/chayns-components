/**
 * @component
 */

import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import CheckboxView from '../views/Checkbox';
import ToggleButton from '../views/ToggleButton';

let checkboxId = 1;

/**
 * Checkboxes allow users to complete tasks that involve making choices such as
 * selecting options. Can be styled as a switch, a visual toggle between two
 * mutually exclusive states — on and off.
 */
const Checkbox = ({
    id,
    toggleButton = false,
    disabled = false,
    stopPropagation = false,
    onChange,
    ...props
}) => {
    const idRef = useRef(`cc_checkbox_${checkboxId++}`);

    const handleChange = (e) => {
        if (!disabled && onChange) {
            onChange(e.target.checked);
        }
    };

    const currentId = id || idRef.current;

    if (toggleButton) {
        return (
            <ToggleButton
                {...props}
                id={currentId}
                disabled={disabled}
                onChange={handleChange}
                stopPropagation={stopPropagation}
            />
        );
    }

    return (
        <CheckboxView
            {...props}
            id={currentId}
            disabled={disabled}
            onChange={handleChange}
            stopPropagation={stopPropagation}
        />
    );
};

export default Checkbox;

Checkbox.propTypes = {
    /**
     * A React style object that will be applied to the CheckBox element.
     */
    style: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),

    /**
     * A classname string that will be applied to the CheckBox element.
     */
    className: PropTypes.string,

    /**
     * A React style object that will be applied to the label element.
     */
    labelStyle: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),

    /**
     * A classname string that will be applied to the label element.
     */
    labelClassName: PropTypes.string,

    /**
     * A label that will be shown next to the CheckBox.
     */
    label: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),

    /**
     * A label that will be shown next to the CheckBox.
     */
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),

    /**
     * This will be called when the state of the CheckBox changes.
     */
    onChange: PropTypes.func,

    /**
     * Changes the rendering to a switch-/toggle-style.
     */
    toggleButton: PropTypes.bool,

    /**
     * Wether the CheckBox is checked. Makes it a controlled input.
     */
    checked: PropTypes.bool,

    /**
     * Wether the CheckBox is checked by default. Do not use it with the
     * `checked`-prop.
     */
    defaultChecked: PropTypes.bool,

    /**
     * Disables any interactions with the CheckBox and changes the style to a
     * disabled look.
     */
    disabled: PropTypes.bool,

    /**
     * Set the contents of the label with a raw HTML string.
     */
    dangerouslySetLabel: PropTypes.shape({
        __html: PropTypes.string.isRequired,
    }),

    /**
     * Wether to stop propagation of click events.
     */
    stopPropagation: PropTypes.bool,

    /**
     * The HTML id of the input element.
     */
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Checkbox.displayName = 'Checkbox';
