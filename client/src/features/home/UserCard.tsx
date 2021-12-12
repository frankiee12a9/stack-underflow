import React from "react"
import { Card, Icon, Image } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { User } from "../../app/models/user"

interface Props {
	user: User
}

export default function UserCard({ user }: Props) {
	return (
		<Card
			as={Link}
			to={`profiles/${user.username}`}
			style={{ width: "220px" }}>
			<Image
				src={user.profilePicture?.url || `assets/user.png`}
				style={{ width: "300px", height: "220px" }}
			/>
			<Card.Content>
				<Card.Header>{user?.username}</Card.Header>
				<Card.Description>{user.desc}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Icon name="user" />
				{user.followers!.length} Followers
			</Card.Content>
		</Card>
	)
}
