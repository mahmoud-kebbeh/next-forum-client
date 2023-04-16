import { createContext, useReducer } from "react";

export const ForumsContext = createContext();

const forumsReducer = (state, action) => {
	switch (action.type) {
		case "GET_FORUMS":
			return {
				forums: action.payload,
			};
			case "CREATE_FORUM":
			return {
				forums: [...state.forums, action.payload],
			};
			// case "EDIT_FORUM":
			// return {
			// 	forums: [...state.forums, action.payload],
			// };
			case "DELETE_FORUM":
			return {
				forums: state.forums.filter(forum => forum._id !== action.payload._id),
			};
			default:
			return state;
	}
}

export function ForumsContextProvider({ children }) {
	const [state, dispatch] = useReducer(forumsReducer, { forums: [] });

	return (
			<ForumsContext.Provider value={ { ...state, dispatch } }>
				{children}
			</ForumsContext.Provider>
		)
}