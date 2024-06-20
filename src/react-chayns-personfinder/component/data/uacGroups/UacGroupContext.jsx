import React, { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { reducer as DefaultReducer, initialState } from './UacGroupReducer';
import { fetchGroups } from './UacGroupApi';

const ObjectMapping = {
    showName: 'showName',
    identifier: 'id',
    search: ['showName', 'name'],
    imageUrl: null,
    filter: (inputValue) => (e) =>
        ['showName', 'name'].some(
            (key) =>
                e[key] &&
                e[key]
                    .toLowerCase()
                    .startsWith((inputValue || '').toLowerCase())
        ),
};

const UacGroupContext = createContext({
    value: null,
});

const UacGroupStateProvider = ({ children = null }) => {
    const [data, dispatch] = useReducer(DefaultReducer, initialState);

    useEffect(() => {
        (async () => {
            dispatch({
                type: 'REQUEST_DATA',
                showWaitCursor: true,
                clear: true,
            });
            const groups = await fetchGroups();
            if (groups) {
                dispatch({
                    type: 'RECEIVE_DATA',
                    data: groups,
                    hasMore: false,
                });
            }
        })();
    }, []);

    return (
        <UacGroupContext.Provider
            value={{
                ...data,
                dispatch,
                onLoadMore: null,
                onChange: () => undefined,
            }}
        >
            {children}
        </UacGroupContext.Provider>
    );
};

UacGroupStateProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default {
    Consumer: UacGroupContext.Consumer,
    Provider: UacGroupStateProvider,
    ObjectMapping,
};
