/**
 * @component
 */

import classNames from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { isDisabled } from '../utils/setupWizardHelper';
import SetupItemRight from './SetupItemRight';
import withSetupWizardContext from './withSetupWizardContext';

/**
 * An item that represents one step in a `SetupWizard`.
 */
const SetupWizardItem = ({
    step,
    showStep,
    title,
    open: openProp = false,
    ready: readyProp = false,
    disabled: disabledProp = false,
    onClick: onClickProp,
    required = false,
    contentStyle = {},
    children,
    enabledSteps = [],
    completedSteps = [],
    currentStep = -1,
    toStep,
    stepRequired,
    right,
    stepEnabled,
    stepComplete,
}) => {
    useEffect(() => {
        stepRequired(required, step);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const disabled = isDisabled(enabledSteps, step);
        if (disabled && !disabledProp && readyProp) {
            stepEnabled(true, step);
            stepComplete(true, step);
        }
    }, [
        enabledSteps,
        disabledProp,
        readyProp,
        step,
        stepComplete,
        stepEnabled,
    ]);

    const disabled = isDisabled(enabledSteps, step) || disabledProp;
    const open = step === currentStep || openProp;
    const ready = completedSteps.indexOf(step) >= 0 || readyProp;
    const onClick = (event) => {
        if (!disabled) {
            if (step === currentStep) {
                toStep(-1);
            } else {
                toStep(step);
            }
            if (onClickProp) {
                onClickProp(event);
            }
        }
    };

    return (
        <div
            className={classNames('accordion', {
                'accordion--open': open,
                'accordion--disabled': disabled,
            })}
        >
            <div
                className={classNames(
                    'accordion__head',
                    'no-arrow',
                    'ellipsis',
                    'wizardHead',
                    { pointer: !disabled }
                )}
                onClick={onClick}
            >
                <div className="accordion__head__icon">
                    <i className="react-chayns-icon ts-angle-right" />
                </div>
                <div className="accordion__head__title">
                    {showStep !== null &&
                        `${
                            (typeof showStep === 'number' ? showStep : step) + 1
                        }. `}
                    {title}
                </div>
                <SetupItemRight ready={ready} right={right} />
            </div>
            <div className="accordion__body" style={contentStyle}>
                {children}
            </div>
        </div>
    );
};

SetupWizardItem.propTypes = {
    /**
     * The index of the step (`0`-based).
     */
    step: PropTypes.number.isRequired,
    showStep: PropTypes.number,

    /**
     * The title of the step.
     */
    title: PropTypes.string.isRequired,
    toStep: PropTypes.func.isRequired,
    stepRequired: PropTypes.func.isRequired,
    open: PropTypes.bool,
    ready: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    contentStyle: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    children: PropTypes.element,

    /**
     * Wether the step is required to continue the wizard.
     */
    required: PropTypes.bool,
    enabledSteps: PropTypes.arrayOf(PropTypes.number),
    completedSteps: PropTypes.arrayOf(PropTypes.number),
    currentStep: PropTypes.number,
    stepEnabled: PropTypes.func.isRequired,
    stepComplete: PropTypes.func.isRequired,

    /**
     * A component that is shown on the right hand of the accordion head.
     */
    right: PropTypes.oneOfType([
        PropTypes.node.isRequired,
        PropTypes.shape({
            complete: PropTypes.node.isRequired,
            notComplete: PropTypes.node.isRequired,
        }).isRequired,
    ]),
};

SetupWizardItem.displayName = 'SetupWizardItem';

export default withSetupWizardContext(SetupWizardItem);
