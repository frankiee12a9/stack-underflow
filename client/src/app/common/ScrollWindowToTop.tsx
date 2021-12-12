import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToTop() {
	const { pathname } = useLocation<{ pathname: string }>()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return null
}
