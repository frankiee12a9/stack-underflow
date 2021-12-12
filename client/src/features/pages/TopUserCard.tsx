import React from "react"
import { Link } from "react-router-dom"
import { Image, Item } from "semantic-ui-react"
import { User } from "../../app/models/user"

interface Props {
	user: User
}

export default function TopUserCard({ user }: Props) {
	function truncateDesc(desc: string, allowLen: number) {
		return desc?.length > allowLen ? desc.substring(0, allowLen) : desc
	}

	return (
		<Item style={{ position: "relative" }}>
			<Image
				size="tiny"
				src={user.profilePicture?.url || "/assets/user.png"}
			/>
			<Item.Content verticalAlign="middle">
				<Item.Header as="h5">
					<Link to={`/profiles/${user.username}`}>
						{user.username}
					</Link>
				</Item.Header>
				<Item.Extra style={{ color: "orange" }}>
					{truncateDesc(user.desc!, 20)}...
				</Item.Extra>
			</Item.Content>
		</Item>
	)
}
