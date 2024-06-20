/**
 * @component
 */

import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import isInIframeDialog from '../utils/isInIframeDialog';
import './ComboBox.scss';
import DialogSelectComboBox from './DialogSelectComboBox';
import HTMLSelectComboBox from './HTMLSelectComboBox';

/**
 * A button with a dropdown that contains a scrollable list of distinct values
 * from which people can choose.
 */
const ComboBox = ({
    className,
    label,
    list,
    disabled = false,
    listValue,
    listKey,
    stopPropagation = false,
    defaultValue,
    parent,
    onSelect,
    style,
    value,
}) => {
    const iframeDialogView = useMemo(isInIframeDialog, []);

    return iframeDialogView ? (
        <HTMLSelectComboBox
            className={className}
            label={label}
            list={list}
            disabled={disabled}
            listValue={listValue}
            listKey={listKey}
            stopPropagation={stopPropagation}
            defaultValue={defaultValue}
            value={value}
            onSelect={onSelect}
        />
    ) : (
        <DialogSelectComboBox
            className={className}
            label={label}
            list={list}
            disabled={disabled}
            listValue={listValue}
            listKey={listKey}
            stopPropagation={stopPropagation}
            defaultValue={defaultValue}
            parent={parent}
            onSelect={onSelect}
            style={style}
            value={value}
        />
    );
};

export default ComboBox;

ComboBox.propTypes = {
    /**
     * This callback is called when an item is selected.
     */
    onSelect: PropTypes.func,

    /**
     * Disables any interactions and styles the combobox with a disabled style.
     */
    disabled: PropTypes.bool,

    /**
     * A placeholder value shown inside the combobox.
     */
    label: PropTypes.string,

    /**
     * An array of values to select from.
     */
    list: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types

    /**
     * The name of the property on the list objects that uniquely identifies an
     * item.
     */
    listKey: PropTypes.string.isRequired,

    /**
     * The name of the property on the list objects that is shown as its name.
     */
    listValue: PropTypes.string.isRequired,

    /**
     * A classname string that will be applied to the Button component and the
     * overlay.
     */
    className: PropTypes.string,

    /**
     * The default value of the combobox. This does not work in combination with
     * the `label` or `value` props.
     */
    defaultValue: PropTypes.string,

    /**
     * Wether to stop the propagation of click events.
     */
    stopPropagation: PropTypes.bool,

    /**
     * The parent component of the combobox overlay.
     */
    parent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),

    /**
     * A React style object that will be applied to the Button component and the
     *  overlay.
     */
    style: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),

    /**
     * The value of the combobox. This does not work in combination with the `
     * label`-prop.
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ComboBox.displayName = 'ComboBox';
