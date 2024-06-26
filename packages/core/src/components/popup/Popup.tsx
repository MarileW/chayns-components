import { getWindowMetrics } from 'chayns-api';
import { AnimatePresence } from 'framer-motion';
import React, {
    forwardRef,
    ReactNode,
    ReactPortal,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useUuid } from '../../hooks/uuid';
import { PopupAlignment, PopupCoordinates, PopupRef } from '../../types/popup';
import AreaContextProvider from '../area-provider/AreaContextProvider';
import PopupContentWrapper from './popup-content-wrapper/PopupContentWrapper';
import { StyledPopup, StyledPopupPseudo } from './Popup.styles';

export type PopupProps = {
    /**
     * The element over which the content of the `ContextMenu` should be displayed.
     */
    children?: ReactNode;
    /**
     * The element where the content of the `Popup` should be rendered via React Portal.
     */
    container?: Element;
    /**
     * The content that should be displayed inside the popup.
     */
    content: ReactNode;
    /**
     * Function to be executed when the content of the Context menu has been hidden.
     */
    onHide?: VoidFunction;
    /**
     * Function to be executed when the content of the Context menu has been shown.
     */
    onShow?: VoidFunction;
    /**
     * Whether the popup should be opened on hover. If not, the popup will be opened on click.
     */
    shouldShowOnHover?: boolean;
    /**
     * The Y offset of the popup to the children.
     */
    yOffset?: number;
};

const Popup = forwardRef<PopupRef, PopupProps>(
    (
        {
            content,
            onShow,
            container = document.querySelector('.tapp') || document.body,
            onHide,
            children,
            shouldShowOnHover = false,
            yOffset = 0,
        },
        ref,
    ) => {
        const [coordinates, setCoordinates] = useState<PopupCoordinates>({
            x: 0,
            y: 0,
        });

        const [alignment, setAlignment] = useState<PopupAlignment>(PopupAlignment.TopLeft);
        const [offset, setOffset] = useState<number>(0);
        const [isOpen, setIsOpen] = useState(false);
        const [portal, setPortal] = useState<ReactPortal>();
        const [menuHeight, setMenuHeight] = useState(0);

        const [pseudoSize, setPseudoSize] = useState<{ height: number; width: number }>();

        const timeout = useRef<number>();

        const uuid = useUuid();

        // ToDo: Replace with hook if new chayns api is ready

        const popupContentRef = useRef<HTMLDivElement>(null);
        const popupPseudoContentRef = useRef<HTMLDivElement>(null);
        const popupRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (popupPseudoContentRef.current) {
                const { height, width } = popupPseudoContentRef.current.getBoundingClientRect();

                setPseudoSize({ height, width });
            }
        }, []);

        const handleShow = useCallback(() => {
            if (popupRef.current && pseudoSize) {
                const { height: pseudoHeight, width: pseudoWidth } = pseudoSize;

                const {
                    height: childrenHeight,
                    left: childrenLeft,
                    top: childrenTop,
                    width: childrenWidth,
                } = popupRef.current.getBoundingClientRect();

                if (pseudoHeight > childrenTop - 25) {
                    let isRight = false;

                    if (pseudoWidth > childrenLeft + childrenWidth / 2 - 25) {
                        setAlignment(PopupAlignment.BottomRight);

                        isRight = true;
                    } else {
                        setAlignment(PopupAlignment.BottomLeft);
                    }

                    const x = childrenLeft + childrenWidth / 2;
                    const y = childrenTop + childrenHeight + yOffset;

                    let newOffset;

                    if (isRight) {
                        newOffset =
                            x + pseudoWidth >= window.innerWidth
                                ? x + pseudoWidth - window.innerWidth
                                : 0;
                    } else {
                        newOffset = 0;

                        const right = window.innerWidth - (childrenLeft + childrenWidth / 2);

                        newOffset =
                            right + pseudoWidth >= window.innerWidth
                                ? right + pseudoWidth - window.innerWidth
                                : 0;
                    }

                    setOffset(newOffset);

                    const newX = x - newOffset;

                    setCoordinates({
                        x: newX < 23 ? 23 : newX,
                        y: y - yOffset,
                    });
                } else {
                    let isRight = false;

                    if (pseudoWidth > childrenLeft + childrenWidth / 2 - 25) {
                        setAlignment(PopupAlignment.TopRight);

                        isRight = true;
                    } else {
                        setAlignment(PopupAlignment.TopLeft);
                    }

                    const x = childrenLeft + childrenWidth / 2;
                    const y = childrenTop - yOffset;

                    let newOffset;

                    if (isRight) {
                        newOffset =
                            x + pseudoWidth >= window.innerWidth
                                ? x + pseudoWidth - window.innerWidth
                                : 0;
                    } else {
                        newOffset = 0;

                        const right = window.innerWidth - (childrenLeft + childrenWidth / 2);

                        newOffset =
                            right + pseudoWidth >= window.innerWidth
                                ? right + pseudoWidth - window.innerWidth
                                : 0;
                    }

                    setOffset(newOffset);

                    const newX = x - newOffset;

                    setCoordinates({
                        x: newX < 23 ? 23 : newX,
                        y: y - yOffset,
                    });
                }

                setIsOpen(true);
            }
        }, [pseudoSize, yOffset]);

        const handleChildrenClick = () => {
            if (!shouldShowOnHover) {
                handleShow();
            }
        };

        const handleHide = useCallback(() => {
            setIsOpen(false);
        }, []);

        const handleMouseEnter = useCallback(() => {
            if (shouldShowOnHover) {
                window.clearTimeout(timeout.current);
                handleShow();
            }
        }, [handleShow, shouldShowOnHover]);

        const handleMouseLeave = useCallback(() => {
            if (!shouldShowOnHover) {
                return;
            }

            timeout.current = window.setTimeout(() => {
                handleHide();
            }, 500);
        }, [handleHide, shouldShowOnHover]);

        const handleDocumentClick = useCallback<EventListener>(
            (event) => {
                if (
                    !popupContentRef.current?.contains(event.target as Node) &&
                    !shouldShowOnHover
                ) {
                    event.preventDefault();
                    event.stopPropagation();

                    handleHide();
                }
            },
            [handleHide, shouldShowOnHover],
        );

        useImperativeHandle(
            ref,
            () => ({
                hide: handleHide,
                show: handleShow,
            }),
            [handleHide, handleShow],
        );

        useEffect(() => {
            void getWindowMetrics().then((result) => {
                if (result.topBarHeight) {
                    setMenuHeight(result.topBarHeight);
                }
            });
        }, []);

        useEffect(() => {
            if (isOpen) {
                document.addEventListener('click', handleDocumentClick, true);
                window.addEventListener('blur', handleHide);

                if (typeof onShow === 'function') {
                    onShow();
                }
            } else if (typeof onHide === 'function') {
                onHide();
            }

            return () => {
                document.removeEventListener('click', handleDocumentClick, true);
                window.removeEventListener('blur', handleHide);
            };
        }, [handleDocumentClick, handleHide, isOpen, onHide, onShow]);

        useEffect(() => {
            setPortal(() =>
                createPortal(
                    <AnimatePresence initial={false}>
                        {isOpen && (
                            <PopupContentWrapper
                                offset={offset}
                                coordinates={coordinates}
                                key={`tooltip_${uuid}`}
                                alignment={alignment}
                                ref={popupContentRef}
                                onMouseLeave={handleMouseLeave}
                                onMouseEnter={handleMouseEnter}
                            >
                                <AreaContextProvider shouldChangeColor={false}>
                                    {content}
                                </AreaContextProvider>
                            </PopupContentWrapper>
                        )}
                    </AnimatePresence>,
                    container,
                ),
            );
        }, [
            alignment,
            container,
            content,
            coordinates,
            handleMouseEnter,
            handleMouseLeave,
            isOpen,
            offset,
            uuid,
        ]);

        return (
            <>
                {!pseudoSize && (
                    <StyledPopupPseudo ref={popupPseudoContentRef} $menuHeight={menuHeight}>
                        {content}
                    </StyledPopupPseudo>
                )}
                <StyledPopup
                    ref={popupRef}
                    onClick={handleChildrenClick}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}
                >
                    {children}
                </StyledPopup>
                {portal}
            </>
        );
    },
);

Popup.displayName = 'Popup';

export default Popup;
