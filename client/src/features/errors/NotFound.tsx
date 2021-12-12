import React from "react"
import { Button, Header, Icon, Segment } from "semantic-ui-react"
import { Link } from "react-router-dom"

export default function NotFound() {
	return (
		<Segment placeholder>
			<Header icon>
				<Icon name="search" />
				Opps-we've looked everywhere and could not found this :(
			</Header>
			<Segment.Inline>
				<Button as={Link} to="/timeline" primary>
					Go back to timeline
				</Button>
			</Segment.Inline>
		</Segment>
	)
}
