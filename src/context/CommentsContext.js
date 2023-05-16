import { createContext, useReducer } from "react";

export const CommentsContext = createContext();

const commentsReducer = (state, action) => {
	switch (action.type) {
		case "GET_COMMENTS":
			return {
				comments: action.payload,
			};
			case "CREATE_COMMENT":
			return {
				comments: [...state.comments, action.payload],
			};
			case "EDIT_COMMENT":
			return {
				comments: [...state.comments.filter(comment => comment._id !== action.payload._id), action.payload].sort((previousComment, nextComment) => previousComment.createdAt - nextComment.createdAt),
			};
			case "DELETE_COMMENT":
			return {
				comments: state.comments.filter(comment => comment._id !== action.payload._id),
			};
			default:
			return state;
	}
}

export function CommentsContextProvider({ children }) {
	const [state, dispatch] = useReducer(commentsReducer, { comments: [] });

	return (
			<CommentsContext.Provider value={ { ...state, dispatch } }>
				{children}
			</CommentsContext.Provider>
		)
}