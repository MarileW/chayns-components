/* eslint-disable react/forbid-prop-types */
import classnames from 'clsx';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import Icon from '../../../react-chayns-icon/component/Icon';

const ListItemHeader = ({
    title,
    subtitle,
    image,
    icon,
    className,
    left,
    right,
    circle = false,
    hoverItem,
    onLongPress,
    longPressTimeout = 450,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    onClick,
    notExpandable,
    noContentClass,
    onOpen,
    headerProps,
    defaultOpen,
    images,
    imageBorderColor,
    openImageOnClick = 'rgba(var(--chayns-color-rgb--009), .08)',
    // eslint-disable-next-line react/prop-types
    headMultiline,
    // eslint-disable-next-line react/prop-types
    headerClassName,
    ...otherProps
}) => {
    const timeout = useRef(null);
    const preventClick = useRef(false);

    const onStart = (event) => {
        if (event.type === 'mousedown' && onMouseDown) {
            onMouseDown(event);
        } else if (event.type === 'touchstart' && onTouchStart) {
            onTouchStart(event);
        }
        if (onLongPress) {
            timeout.current = setTimeout(() => {
                preventClick.current = true;
                onLongPress(event);
            }, longPressTimeout);
        }
    };

    const onEnd = (event) => {
        if (event.type === 'mousemove' && onMouseMove) {
            onMouseMove(event);
        } else if (event.type === 'mouseup' && onMouseUp) {
            onMouseUp(event);
        } else if (event.type === 'touchmove' && onTouchMove) {
            onTouchMove(event);
        } else if (event.type === 'touchend' && onTouchEnd) {
            onTouchEnd(event);
        } else if (event.type === 'touchcancel' && onTouchCancel) {
            onTouchCancel(event);
        }
        if (onLongPress) {
            clearTimeout(timeout.current);
            if (event.type === 'mouseup' || event.type === 'touchend') {
                setTimeout(() => {
                    preventClick.current = false;
                }, 150);
            }
        }
    };

    const handleClick = (event) => {
        if (onLongPress && preventClick.current) {
            preventClick.current = false;
        } else if (onClick) {
            onClick(event);
        }
    };

    return (
        <div
            className={classnames('list-item__header', className)}
            onMouseDown={onMouseDown || onLongPress ? onStart : null}
            onMouseMove={onMouseMove || onLongPress ? onEnd : null}
            onMouseUp={onMouseUp || onLongPress ? onEnd : null}
            onTouchStart={onTouchStart || onLongPress ? onStart : null}
            onTouchMove={onTouchMove || onLongPress ? onEnd : null}
            onTouchEnd={onTouchEnd || onLongPress ? onEnd : null}
            onTouchCancel={onTouchCancel || onLongPress ? onEnd : null}
            onClick={handleClick}
            {...otherProps}
        >
            {left}
            {image && (
                <div
                    className={classnames('list-item__image', {
                        'list-item__image--circle': circle,
                    })}
                    style={{
                        boxShadow: `0 0 0 1px ${imageBorderColor} inset`,
                        backgroundImage: `url(${image})`,
                    }}
                    onClick={(event) => {
                        if (openImageOnClick) {
                            event.stopPropagation();
                            chayns.openImage(image);
                        }
                    }}
                />
            )}
            {images && (
                <div
                    className={classnames('list-item__images', {
                        'list-item__image--circle': circle,
                    })}
                    style={{
                        boxShadow: `0 0 0 1px ${imageBorderColor} inset`,
                    }}
                    onClick={(event) => {
                        if (openImageOnClick) {
                            event.stopPropagation();
                            chayns.openImage(images);
                        }
                    }}
                >
                    {images.map((img, index) => {
                        if (index > 2) return null;
                        return (
                            <div
                                key={img}
                                className="list-item__image"
                                style={{
                                    backgroundImage: `url(${img})`,
                                }}
                            />
                        );
                    })}
                </div>
            )}
            {icon && (
                <Icon
                    className={classnames(
                        'list-item__icon chayns__background-color--102 chayns__color--headline',
                        {
                            'list-item__icon--circle': circle,
                        }
                    )}
                    icon={icon}
                />
            )}
            {(title || subtitle) && (
                <div className="list-item__titles">
                    {(title || (Array.isArray(right) && right.length > 0)) &&
                        (Array.isArray(right) && right.length > 0 ? (
                            <div className="list-item__title-wrapper">
                                <div className="list-item__title ellipsis">
                                    {title || ''}
                                </div>
                                <div
                                    className="list-item__right"
                                    style={
                                        typeof right[0] === 'string'
                                            ? { opacity: 0.75 }
                                            : null
                                    }
                                >
                                    {right[0]}
                                </div>
                            </div>
                        ) : (
                            <div className="list-item__title ellipsis">
                                {title}
                            </div>
                        ))}
                    {(subtitle || (Array.isArray(right) && right.length > 1)) &&
                        (Array.isArray(right) && right.length > 1 ? (
                            <div className="list-item__subtitle-wrapper">
                                <div className="list-item__subtitle ellipsis">
                                    {subtitle}
                                </div>
                                <div className="list-item__right">
                                    {right[1]}
                                </div>
                            </div>
                        ) : (
                            <div className="list-item__subtitle ellipsis">
                                {subtitle}
                            </div>
                        ))}
                </div>
            )}
            <div className="list-item__spacer" />
            {right && !Array.isArray(right) && (
                <div className="list-item__right">{right}</div>
            )}
            {hoverItem && (
                <div className="list-item__hover-item" tabIndex={-1}>
                    {hoverItem}
                </div>
            )}
        </div>
    );
};

ListItemHeader.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
    subtitle: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    openImageOnClick: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    left: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    right: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    circle: PropTypes.bool,
    hoverItem: PropTypes.node,
    onLongPress: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseUp: PropTypes.func,
    onTouchStart: PropTypes.func,
    onTouchMove: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onTouchCancel: PropTypes.func,
    onClick: PropTypes.func,
    longPressTimeout: PropTypes.number,
    notExpandable: PropTypes.bool,
    noContentClass: PropTypes.bool,
    onOpen: PropTypes.func,
    headerProps: PropTypes.object,
    defaultOpen: PropTypes.bool,
    imageBorderColor: PropTypes.string,
};

ListItemHeader.displayName = 'ListItemHeader';

export default ListItemHeader;
