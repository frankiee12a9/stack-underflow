import React from "react"
import { Button, Header, Segment } from "semantic-ui-react"
import axios from "axios"

export default function TestErrors() {
	const baseUrl = process.env.REACT_APP_API_URL

	function handleNotFound() {
		axios
			.get(baseUrl + "/errors/notfound")
			.catch(err => console.log(err.response))
	}

	function handleBadRequest() {
		axios
			.get(baseUrl + "/errors/badRequest")
			.catch(err => console.log(err.response))
	}

	function handleServerError() {
		axios
			.get(baseUrl + "/errors/server-error")
			.catch(err => console.log(err.response))
	}

	function handleUnauthorised() {
		axios
			.get(baseUrl + "/errors/unauthorised")
			.catch(err => console.log(err.response))
	}

	return (
		<>
			<Header as="h1" content="Test Errors" />
			<Segment>
				<Button.Group widths="7">
					<Button
						onClick={handleNotFound}
						content="Not Found"
						basic
						primary
					/>
					<Button
						onClick={handleBadRequest}
						content="Bad Request"
						basic
						primary
					/>
					<Button
						onClick={handleServerError}
						content="Server Error"
						basic
						primary
					/>
					<Button
						onClick={handleUnauthorised}
						content="Unauthorised"
						basic
						primary
					/>
				</Button.Group>
			</Segment>
		</>
	)
}
