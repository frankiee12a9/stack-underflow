import React, { useState } from "react"
import { Button, Header, Segment } from "semantic-ui-react"
import axios from "axios"
import ValidationError from "./ValidationError"

export default function TestErrors() {
	const baseUrl = process.env.REACT_APP_API_URL
	// const baseUrl = "http://localhost:8800/api/"
	const [errors, setErrors] = useState(null)

	function handleNotFound() {
		axios
			.get(baseUrl + "errors/notFound")
			.catch(err => console.log(err.response))
	}

	function handleBadRequest() {
		axios
			.get(baseUrl + "errors/badRequest")
			.catch(err => console.log(err.response))
	}

	function handleServerError() {
		axios
			.get(baseUrl + "errors/serverError")
			.catch(err => console.log(err.response))
	}

	function handleUnauthorised() {
		axios
			.get(baseUrl + "errors/unauthorised")
			.catch(err => console.log(err.response))
	}

	function handleValidationError() {
		axios.post(baseUrl + "timeline", {}).catch(err => setErrors(err))
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
						onClick={handleValidationError}
						content="Validation Error"
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
			{errors && <ValidationError errors={errors} />}
		</>
	)
}
