import { useStore } from "app/stores/store"
import LoginForm from "features/auth/LoginForm"
import RegisterForm from "features/auth/RegisterForm"
import { observer } from "mobx-react-lite"
import React from "react"
import { Link } from "react-router-dom"
import { Container, Header, Segment, Image, Button } from "semantic-ui-react"

export default observer(function HomePage() {
	const {
		authStore: { isLoggedIn },
		modalStore,
	} = useStore()

	return (
		<Segment inverted textAlign="center" vertical className="masthead">
			<Container text>
				<Header as="h1" inverted>
					<Image
						size="massive"
						src="/assets/qa2.png"
						alt="logo"
						style={{ marginBottom: 12 }}
					/>
					StackUnderflow
				</Header>
				<Header as="h2" inverted content="Welcome to StackUnderflow" />
				{isLoggedIn ? (
					<Button as={Link} to="/timeline" size="huge" inverted>
						Go to App
					</Button>
				) : (
					<>
						<Button
							size="huge"
							inverted
							onClick={e => modalStore.openModal(<LoginForm />)}>
							Login
						</Button>
						<Button
							size="huge"
							inverted
							onClick={() =>
								modalStore.openModal(<RegisterForm />)
							}>
							Register
						</Button>
					</>
				)}
			</Container>
		</Segment>
	)
})
