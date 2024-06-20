import classnames from 'clsx';
import PropTypes from 'prop-types';
import React, {
    useCallback,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import Overlay from '../../components/overlay/Overlay';
import Input from '../../react-chayns-input/component/Input';
import { isFunction } from '../../utils/is';
import { isServer } from '../../utils/isServer';
import Icon from '../../react-chayns-icon/component/Icon';

const InputBox = React.forwardRef((props, ref) => {
    const {
        inputComponent: InputComponent = Input,
        children,
        parent,
        inputRef,
        onFocus,
        className,
        overlayProps,
        boxClassName,
        style,
        onBlur,
        hasOpenCloseIcon = false,
        renderInline = false,
        hideInput = false,
        ...restProps
    } = props;

    const wrapperRef = useRef();
    const boxRef = useRef();
    const hasTouchStartedRef = useRef(false);

    const [isHidden, setIsHidden] = useState(true);
    const [rect, setRect] = useState(null);

    useLayoutEffect(() => {
        if (wrapperRef.current && !isHidden) {
            const wrapperRect = wrapperRef.current.getBoundingClientRect();

            const parentElement = !isServer() ? parent || document.body : null;
            const parentRect = parentElement?.getBoundingClientRect();
            const isParentRelative = parentElement
                ? ['absolute', 'relative'].includes(
                      getComputedStyle(parentElement).position
                  ) || parentElement === document.body
                : false;

            setRect({
                top:
                    wrapperRect.top -
                    (isParentRelative
                        ? (parentRect?.top ?? 0) - parentElement.scrollTop
                        : 0),
                bottom:
                    wrapperRect.bottom -
                    (isParentRelative
                        ? (parentRect?.top ?? 0) - parentElement.scrollTop
                        : 0),
                left:
                    wrapperRect.left -
                    (isParentRelative ? parentRect?.left ?? 0 : 0),
                width: wrapperRect.width,
            });
        }
    }, [isHidden, parent]);

    useImperativeHandle(
        ref,
        () => ({
            focus() {
                setIsHidden(false);
            },
            blur() {
                setIsHidden(true);
            },
            getHiddenState() {
                return isHidden;
            },
        }),
        [isHidden]
    );

    useEffect(() => {
        function handleBlur(event) {
            if (!hasTouchStartedRef.current && event.type === 'click') {
                return;
            }
            if (isHidden) return;

            if (
                wrapperRef.current?.contains(event.target) ||
                boxRef.current?.contains(event.target)
            ) {
                return;
            }

            setIsHidden(true);

            if (onBlur && isFunction(onBlur)) {
                onBlur(event);
            }
        }

        function hide() {
            setIsHidden(true);
        }

        function handleKeyDown({ keyCode, target }) {
            if (keyCode === 9 && wrapperRef.current?.contains(target)) {
                hide();
            }
        }

        function handleTouchStart() {
            hasTouchStartedRef.current = true;
        }

        function handleTouchEnd() {
            hasTouchStartedRef.current = false;
        }

        document.addEventListener('click', handleBlur);
        document.addEventListener('mousedown', handleBlur);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('mousemove', handleTouchEnd);

        window.addEventListener('blur', hide);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleBlur);
            document.removeEventListener('mousedown', handleBlur);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('mousemove', handleTouchEnd);

            window.removeEventListener('blur', hide);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isHidden, onBlur]);

    const handleFocus = (e) => {
        setIsHidden(false);

        if (onFocus) {
            return onFocus(e);
        }
        return null;
    };

    const setBoxRef = useCallback(
        (node) => {
            boxRef.current = node;

            if (overlayProps?.ref) {
                overlayProps.ref(node);
            }
        },
        [overlayProps]
    );

    const toggle = useCallback((event) => {
        setIsHidden((hidden) => !hidden);
        event.stopPropagation();
    }, []);

    if (!InputComponent) {
        return null;
    }

    const positionStyles = rect
        ? {
              width: rect.width,
              top: rect.bottom,
              left: rect.left,
          }
        : null;

    let { right, icon, onIconClick } = restProps;

    if (hasOpenCloseIcon) {
        if (
            restProps.design === Input.BORDER_DESIGN &&
            InputComponent.displayName === Input.displayName
        ) {
            right = (
                <Icon
                    icon="fa fa-chevron-down"
                    style={{
                        padding: '10px',
                        alignItems: 'center',
                        alignSelf: 'stretch',
                    }}
                    onClick={toggle}
                />
            );
        } else {
            icon = 'fa fa-chevron-down';
            onIconClick = toggle;
        }
    }

    return (
        <div
            style={{
                display: renderInline ? 'flex' : 'inline-block',
                ...(renderInline
                    ? { height: '100%', flexDirection: 'column' }
                    : {}),
                ...style,
            }}
            className={classnames(
                { 'cc__input-box': !renderInline },
                className
            )}
            ref={wrapperRef}
        >
            <InputComponent
                {...restProps}
                right={right}
                icon={icon}
                onIconClick={onIconClick}
                style={
                    renderInline && hideInput
                        ? { position: 'absolute', visibility: 'hidden' }
                        : undefined
                }
                ref={inputRef}
                onFocus={handleFocus}
            />
            {renderInline ? (
                <div
                    className="cc__input-box--inline-wrapper scrollbar"
                    style={{
                        marginTop: !hideInput ? 20 : 0,
                        overflow: 'hidden auto',
                    }}
                >
                    {children}
                </div>
            ) : (
                <Overlay parent={parent}>
                    {!!(rect && children) && (
                        <div
                            onClick={(e) => e.preventDefault()}
                            className={classnames(
                                'cc__input-box__overlay',
                                'scrollbar',
                                boxClassName
                            )}
                            style={{
                                ...positionStyles,
                                ...overlayProps?.style,
                                ...(isHidden ? { display: 'none' } : {}),
                            }}
                            {...overlayProps}
                            ref={setBoxRef}
                        >
                            {children}
                        </div>
                    )}
                </Overlay>
            )}
        </div>
    );
});

InputBox.propTypes = {
    onBlur: PropTypes.func,
    inputComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    parent:
        typeof Element !== 'undefined'
            ? PropTypes.instanceOf(Element)
            : () => {},
    onFocus: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    className: PropTypes.string,
    boxClassName: PropTypes.string,
    inputRef: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    overlayProps: PropTypes.object,
    style: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    hasOpenCloseIcon: PropTypes.bool,
    renderInline: PropTypes.bool,
    hideInput: PropTypes.bool,
};

InputBox.displayName = 'InputBox';

export default InputBox;
