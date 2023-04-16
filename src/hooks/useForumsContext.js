import { useContext } from "react"

import { ForumsContext } from "./../context/ForumsContext.js"

export default function useForumsContext() {
	const context = useContext(ForumsContext);

	if (!context) throw new Error("useForumsContext must be used inside an ForumsContextProvider!");

	return context;
}