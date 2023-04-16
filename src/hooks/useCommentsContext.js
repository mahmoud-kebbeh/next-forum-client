import { useContext } from "react"

import { CommentsContext } from "./../context/CommentsContext.js"

export default function useCommentsContext() {
	const context = useContext(CommentsContext);

	if (!context) throw new Error("useCommentsContext must be used inside an CommentsContextProvider!");

	return context;
}