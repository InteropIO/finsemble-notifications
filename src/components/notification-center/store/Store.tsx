import * as React from "react";

const { useReducer } = React;

const initialState: State = {
	windowId: "",
	windowPosition: { bottom: 0, right: 0, height: 60 },
	notifications: []
};

export const types = {
	SET_WINDOW_ID: "SET_WINDOW_ID",
	SET_WINDOW_POSITION: "SET_WINDOW_POSITION",
	ADD_NOTIFICATION: "ADD_NOTIFICATION",
	REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION"
};

export function reducer(state: State, action: Action) {
	switch (action.type) {
		case types.SET_WINDOW_ID:
			return { ...state, ...{ windowId: action.payload.windowId } };
		case types.SET_WINDOW_POSITION:
			return { ...state, ...{ windowPosition: action.payload.windowPosition } };
		// case types.ADD_NOTIFICATION:
		// 	return {...state, ...{notifications:}}
		default:
			return state;
	}
}

export const StoreContext: React.Context<any> = React.createContext(
	initialState
);

export const StoreProvider = (props: any): React.ReactElement => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			{props.children}
		</StoreContext.Provider>
	);
};
