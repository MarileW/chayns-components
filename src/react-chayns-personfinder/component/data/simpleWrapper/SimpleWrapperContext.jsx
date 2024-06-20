/* eslint-disable react/forbid-prop-types,react-hooks/exhaustive-deps */
import React, { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const SimpleWrapperContext = createContext({
    value: null,
});

const SimpleWrapperStateProvider = ({
    children,
    data = [],
    hasMore = false,
    onLoadMore,
    onInput,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const loadMore = useCallback(async () => {
        if (isLoading || !onLoadMore) return;

        setIsLoading(true);
        try {
            await onLoadMore();
        } finally {
            setIsLoading(false);
        }
    }, [onLoadMore, isLoading]);

    const onChange = useCallback(
        async (value) => {
            setIsLoading(true);
            try {
                await onInput(value);
            } finally {
                setIsLoading(false);
            }
        },
        [onInput]
    );

    return (
        <SimpleWrapperContext.Provider
            value={{
                data,
                showWaitCursor: isLoading,
                isLoading,
                hasMore,
                onLoadMore: loadMore,
                onChange,
            }}
        >
            {children}
        </SimpleWrapperContext.Provider>
    );
};

SimpleWrapperStateProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    data: PropTypes.array,
    hasMore: PropTypes.bool,
    onLoadMore: PropTypes.func,
    onInput: PropTypes.func,
};

export default (objectMapping) => ({
    Consumer: SimpleWrapperContext.Consumer,
    Provider: SimpleWrapperStateProvider,
    ObjectMapping: objectMapping,
});
