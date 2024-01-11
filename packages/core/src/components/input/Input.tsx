import React, {
    ChangeEvent,
    ChangeEventHandler,
    FocusEventHandler,
    forwardRef,
    HTMLInputTypeAttribute,
    KeyboardEventHandler,
    ReactNode,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useTheme } from 'styled-components';
import type { Theme } from '../color-scheme-provider/ColorSchemeProvider';
import Icon from '../icon/Icon';
import {
    StyledInput,
    StyledInputContent,
    StyledInputField,
    StyledInputIconWrapper,
    StyledMotionInputClearIcon,
    StyledMotionInputLabel,
} from './Input.styles';

export type InputRef = {
    focus: VoidFunction;
};

type InputMode =
    | 'email'
    | 'search'
    | 'tel'
    | 'text'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal'
    | undefined;

export type InputProps = {
    /**
     * Icon element to be displayed on the left side of the input field
     */
    iconElement?: ReactNode;
    /**
     * Defines the input mode of the input
     */
    inputMode?: InputMode;
    /**
     * Disables the input so that it cannot be changed anymore
     */
    isDisabled?: boolean;
    /**
     * Function that is executed when the input field loses focus
     */
    onBlur?: FocusEventHandler<HTMLInputElement>;
    /**
     * Function that is executed when the text of the input changes
     */
    onChange?: ChangeEventHandler<HTMLInputElement>;
    /**
     * Function that is executed when the input field is focused
     */
    onFocus?: FocusEventHandler<HTMLInputElement>;
    /**
     * Function that is executed when a letter is pressed
     */
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
    /**
     * Placeholder for the input field
     */
    placeholder?: string;
    /**
     * Element to be displayed next to or instead of the "placeholder"
     */
    placeholderElement?: ReactNode;
    /**
     * If true, a clear icon is displayed at the end of the input field
     */
    shouldShowClearIcon?: boolean;
    /**
     * Input type set for input element (e.g. 'text', 'number' or 'password')
     */
    type?: HTMLInputTypeAttribute;
    /**
     * Value if the input field should be controlled
     */
    value?: string;
    /**
     * If true, the input field is focused when the component is mounted
     */
    shouldUseAutoFocus?: boolean;
    /**
     * If true, the input field is marked as invalid
     */
    isInvalid?: boolean;
};

const Input = forwardRef<InputRef, InputProps>(
    (
        {
            iconElement,
            inputMode,
            isDisabled,
            onBlur,
            onChange,
            onFocus,
            onKeyDown,
            placeholder,
            placeholderElement,
            shouldShowClearIcon = false,
            type = 'text',
            value,
            shouldUseAutoFocus = false,
            isInvalid = false,
        },
        ref,
    ) => {
        const [hasValue, setHasValue] = useState(typeof value === 'string' && value !== '');
        const theme = useTheme() as Theme;
        const inputRef = useRef<HTMLInputElement>(null);

        const handleClearIconClick = useCallback(() => {
            if (inputRef.current) {
                inputRef.current.value = '';

                setHasValue(false);

                if (typeof onChange === 'function') {
                    onChange({ target: inputRef.current } as ChangeEvent<HTMLInputElement>);
                }
            }
        }, [onChange]);

        const handleInputFieldChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                setHasValue(event.target.value !== '');

                if (typeof onChange === 'function') {
                    onChange(event);
                }
            },
            [onChange],
        );

        useImperativeHandle(
            ref,
            () => ({
                focus: () => inputRef.current?.focus(),
            }),
            [],
        );

        useEffect(() => {
            if (typeof value === 'string') {
                setHasValue(value !== '');
            }
        }, [value]);

        const labelPosition = useMemo(() => {
            if (hasValue) {
                return { bottom: -8, right: -6 };
            }

            return { left: 0, top: 0 };
        }, [hasValue]);

        return (
            <StyledInput
                className="beta-chayns-input"
                isDisabled={isDisabled}
                isInvalid={isInvalid}
            >
                {iconElement && <StyledInputIconWrapper>{iconElement}</StyledInputIconWrapper>}
                <StyledInputContent>
                    <StyledInputField
                        disabled={isDisabled}
                        onBlur={onBlur}
                        onChange={handleInputFieldChange}
                        onFocus={onFocus}
                        onKeyDown={onKeyDown}
                        ref={inputRef}
                        type={type}
                        value={value}
                        autoFocus={shouldUseAutoFocus}
                        inputMode={inputMode}
                        isInvalid={isInvalid}
                    />
                    <StyledMotionInputLabel
                        animate={{
                            fontSize: hasValue ? '10px' : '16px',
                        }}
                        initial={false}
                        layout
                        style={{ ...labelPosition }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        isInvalid={isInvalid}
                    >
                        {placeholderElement}
                        {placeholder}
                    </StyledMotionInputLabel>
                </StyledInputContent>
                {shouldShowClearIcon && (
                    <StyledMotionInputClearIcon
                        animate={{ opacity: hasValue ? 1 : 0 }}
                        initial={false}
                        onClick={handleClearIconClick}
                        transition={{ type: 'tween' }}
                        isInvalid={isInvalid}
                    >
                        <Icon icons={['fa fa-times']} color={isInvalid ? theme.wrong : undefined} />
                    </StyledMotionInputClearIcon>
                )}
            </StyledInput>
        );
    },
);

Input.displayName = 'Input';

export default Input;
