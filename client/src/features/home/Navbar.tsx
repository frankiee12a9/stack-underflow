import React from "react"
import * as semanticUiReact from "semantic-ui-react"
import { Link, NavLink } from "react-router-dom"
import { Image, Dropdown, Menu } from "semantic-ui-react"
import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store"

export default observer(function Navbar() {
	const {
		authStore: { isLoggedIn, user, getUser, logout },
	} = useStore()

	return (
		<semanticUiReact.Menu color="teal" inverted fixed="top">
			<semanticUiReact.Container>
				<semanticUiReact.Item
					header
					exact
					as={NavLink}
					to="/"
					content="Home"
				/>
				<semanticUiReact.Item
					as={NavLink}
					to="/profiles"
					exact
					content="Users"
				/>
				<semanticUiReact.Item
					as={NavLink}
					to="/timeline"
					exact
					content="Timeline"
				/>
				<semanticUiReact.Item
					as={NavLink}
					to="/errors"
					content="Errors Page"
				/>
				{isLoggedIn && (
					<Menu.Item position="right">
						<Image
							src={
								user?.profilePicture?.url || "/assets/user.png"
							}
							alt="logo"
							avatar
							spaced="right"
						/>
						<Dropdown pointing="top left" text={user?.username}>
							<Dropdown.Menu>
								<Dropdown.Item
									content="My profile"
									// text="My Profile"
									as={Link}
									to={`/profiles/${user?.username}`}
									icon="user"
									onClick={() => getUser}>
									{/* My Profile */}
								</Dropdown.Item>
								<Dropdown.Item
									as={Link}
									to="/"
									onClick={logout}
									icon="power">
									Logout
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Menu.Item>
				)}
			</semanticUiReact.Container>
		</semanticUiReact.Menu>
	)
})
