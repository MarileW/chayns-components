import classnames from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import stopPropagationListener from '../../utils/stopPropagationListener';

const CHECKBOX_LABEL_STYLE = { display: 'inline' };

const Checkbox = React.forwardRef((props, ref) => {
    const {
        id,
        style,
        disabled = false,
        children,
        label,
        onChange,
        checked,
        className,
        defaultChecked,
        dangerouslySetLabel,
        labelStyle,
        labelClassName,
        stopPropagation = false,
    } = props;

    let modifiedLabelStyle = labelStyle;
    if (!label && !dangerouslySetLabel && !children) {
        modifiedLabelStyle = {
            ...labelStyle,
            ...CHECKBOX_LABEL_STYLE,
        };
    }

    return (
        <div className={classnames('cc__checkbox', className)}>
            <input
                key="input"
                type="checkbox"
                className="checkbox"
                ref={ref}
                onClick={stopPropagation ? stopPropagationListener : null}
                onChange={onChange}
                id={id}
                disabled={disabled}
                checked={checked}
                defaultChecked={defaultChecked}
                style={style}
            />
            <label
                key="label"
                style={modifiedLabelStyle}
                className={labelClassName}
                onClick={stopPropagation ? stopPropagationListener : null}
                htmlFor={id}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={dangerouslySetLabel}
            >
                {!dangerouslySetLabel ? children || label || '' : null}
            </label>
        </div>
    );
});

Checkbox.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    style: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    className: PropTypes.string,
    labelStyle: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    labelClassName: PropTypes.string,
    label: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    dangerouslySetLabel: PropTypes.object,
    stopPropagation: PropTypes.bool,
};

Checkbox.displayName = 'Checkbox';

export default Checkbox;
