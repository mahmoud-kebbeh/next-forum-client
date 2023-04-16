import { useContext } from "react"

import { TopicsContext } from "./../context/TopicsContext.js"

export default function useTopicsContext() {
	const context = useContext(TopicsContext);

	if (!context) throw new Error("useTopicsContext must be used inside an TopicsContextProvider!");

	return context;
}