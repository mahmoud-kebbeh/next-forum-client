import { createContext, useReducer } from "react";

export const TopicsContext = createContext();

const topicsReducer = (state, action) => {
	switch (action.type) {
		case "GET_TOPICS":
			return {
				topics: action.payload,
			};
			case "CREATE_TOPIC":
			return {
				topics: [action.payload, ...state.topics],
			};
			// case "EDIT_TOPIC":
			// return {
			// 	topics: [...state.topics, action.payload],
			// };
			case "DELETE_TOPIC":
			return {
				topics: state.topics.filter(topic => topic._id !== action.payload._id),
			};
			default:
			return state;
	}
}

export function TopicsContextProvider({ children }) {
	const [state, dispatch] = useReducer(topicsReducer, { topics: [] });

	return (
			<TopicsContext.Provider value={ { ...state, dispatch } }>
				{children}
			</TopicsContext.Provider>
		)
}