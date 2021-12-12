import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import "semantic-ui-css/semantic.min.css"
import { Router } from "react-router-dom"
import { store, StoreContext } from "./app/stores/store"
import { createBrowserHistory } from "history"
import "react-toastify/dist/ReactToastify.min.css"
import "react-toastify/dist/ReactToastify.css"
import App from "./App"
import ScrollWindowToTop from "app/common/ScrollWindowToTop"

// this will be visibled anywhere in app
export const history = createBrowserHistory()

ReactDOM.render(
	<React.StrictMode>
		<StoreContext.Provider value={store}>
			<Router history={history}>
				<ScrollWindowToTop />
				<App />
			</Router>
		</StoreContext.Provider>
	</React.StrictMode>,
	document.getElementById("root")
)
