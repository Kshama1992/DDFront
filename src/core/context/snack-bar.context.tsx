import React, { createContext, useReducer } from 'react';

interface SnackBarState {
	visible?: boolean;
	message: string;
	link?: string | undefined;
	linkText?: string | undefined;
	state?: 'info' | 'error' | 'warning';
}

interface DefaultContext {
	snackBarState: SnackBarState;
	snackBarDispatch: ({ type }: { type: 'hide' | 'show' }) => void;
	showSnackBar: (m: SnackBarState | string) => void;
	hideSnackBar: () => void;
}

const SnackBarContext = createContext<DefaultContext>({} as DefaultContext);

const initialState: SnackBarState = {
	visible: false,
	message: '',
	state: 'info',
};

const reducer = (state: SnackBarState, action: { type: string; payload?: SnackBarState | string }): SnackBarState => {
	switch (action.type) {
		case 'hide':
			return { ...state, visible: false, message: '', link: undefined, linkText: undefined, state: 'info' };
		case 'show':
			if (action.payload && typeof action.payload !== 'string' && action.payload.link && action.payload.message) {
				let substate = { ...state, visible: true };
				if (action.payload.link) substate = { ...substate, link: action.payload.link };
				if (action.payload.linkText) substate = { ...substate, linkText: action.payload.linkText };
				if (action.payload.message) substate = { ...substate, message: action.payload.message };
				if (action.payload.state) substate = { ...substate, state: action.payload.state };
				return substate;
			}
			return { ...state, visible: true, message: String(action.payload) };
		default:
			return initialState;
	}
};

function SnackBarProvider(props: any) {
	const { children } = props;
	const [snackBarState, snackBarDispatch] = useReducer(reducer, initialState);
	const showSnackBar = (m: SnackBarState | string) => snackBarDispatch({ type: 'show', payload: m });
	const hideSnackBar = () => snackBarDispatch({ type: 'hide' });
	const value = { snackBarState, snackBarDispatch, showSnackBar, hideSnackBar };
	return <SnackBarContext.Provider value={value}>{children}</SnackBarContext.Provider>;
}

export { SnackBarContext, SnackBarProvider };
