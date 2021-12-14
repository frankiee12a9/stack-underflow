import FormUploadImage from "app/common/form/FormUploadImage"
import ImageUploadWidget from "app/common/imageUpload/ImageUploadWidget"
import { observer } from "mobx-react-lite"
import React, { SyntheticEvent, useEffect, useState } from "react"
import {
	Button,
	Divider,
	Grid,
	Header,
	Icon,
	Item,
	Reveal,
	Segment,
	Statistic,
} from "semantic-ui-react"
import AppModal from "../../app/common/modal/AppModal"
import { User } from "../../app/models/user"
import { useStore } from "../../app/stores/store"

interface Props {
	userProfile: User
}

export default observer(function UserProfileHeader({ userProfile }: Props) {
	const {
		userStore: {
			updateFollowing,
			updateLoading,
			loadingImage,
			profileUser,
			uploadProfilePicture,
			deleteProfilePicture,
		},
		authStore: { user },
		modalStore,
		postStore: { getPostBasedOnUsername },
	} = useStore()

	const [followersCount, setFollowersCount] = useState(
		profileUser?.followers?.length!
	)

	const isFollowing = user?.following?.includes(profileUser?.username!)
	useEffect(() => {
		if (profileUser?.username) {
			getPostBasedOnUsername(profileUser.username)
		}
	}, [profileUser?.username, getPostBasedOnUsername])

	useEffect(() => {
		if (isFollowing) console.log("You are following this user")
		else console.log("You are not following this user")
	}, [isFollowing])

	const joinedDate = new Date(profileUser?.createdAt!),
		month = joinedDate.getUTCMonth() + 1,
		day = joinedDate.getUTCDate(),
		year = joinedDate.getUTCFullYear(),
		memberSince = `${year}/${month}/${day}`

	const handleFollowing = (e: SyntheticEvent, username: string) => {
		e.preventDefault()
		updateFollowing(username)
		if (isFollowing) {
			setFollowersCount(followersCount - 1)
		} else {
			setFollowersCount(followersCount + 1)
		}
	}

	const host = (
		<Item.Image
			style={{ cursor: "pointer" }}
			onClick={() =>
				modalStore.openModal(
					<ImageUploadWidget
						uploadImage={uploadProfilePicture}
						deleteImage={deleteProfilePicture}
						profilePicture={profileUser?.profilePicture!}
						loading={loadingImage}
					/>
				)
			}
			src={profileUser?.profilePicture?.url || `/assets/user.png`}
		/>
	)

	const guest = (
		<Item.Image
			style={{ cursor: "pointer" }}
			onClick={() => modalStore.openModal(<FormUploadImage />)}
			src={profileUser?.profilePicture?.url || `/assets/user.png`}
		/>
	)

	const reputationText =
		profileUser?.reputation! > 0
			? `${profileUser?.reputation} reputations`
			: `${profileUser?.reputation} reputation`

	return (
		<Segment>
			<Grid>
				<Grid.Column width={12}>
					<Item.Group>
						{modalStore.modal.open && <AppModal />}
						<Item>
							{user?.username === profileUser?.username
								? host
								: guest}
							<Item.Content verticalAlign="middle" width={6}>
								<Header
									as="h1"
									content={userProfile.username}
								/>
								<Item.Description as="h6">
									<abbr>
										<Icon name="birthday" />
										Member since {memberSince}
									</abbr>
									<br />
									{userProfile.twitterUrl && (
										<a
											href={`${userProfile.twitterUrl}`}
											rel="noreferrer"
											target="_blank">
											<Icon
												color="grey"
												name="twitter"
												size="large"
											/>
										</a>
									)}
									{userProfile.githubUrl && (
										<a
											href={`${userProfile.githubUrl}`}
											rel="noreferrer"
											target="_blank">
											<Icon
												color="grey"
												name="github"
												size="large"
											/>
										</a>
									)}
									{userProfile.personalBlogUrl && (
										<a
											href={`/${userProfile.personalBlogUrl}`}
											rel="noreferrer"
											target="_blank">
											<Icon
												color="grey"
												name="linkify"
												size="large"
											/>
											{userProfile.personalBlogUrl}
										</a>
									)}
									<br />
									{userProfile.lives && (
										<abbr>
											<Icon
												color="grey"
												size="large"
												name="map marker alternate"
											/>
											{userProfile.from}
										</abbr>
									)}
									<br />
									<abbr>
										<Icon
											color="grey"
											size="large"
											name="star"
										/>
										{reputationText}
									</abbr>
								</Item.Description>
							</Item.Content>
						</Item>
					</Item.Group>
				</Grid.Column>
				<Grid.Column width={4}>
					<Statistic.Group style={{ marginLeft: "5px" }}>
						<Statistic
							size="tiny"
							label="Followers"
							value={followersCount}
						/>
						<Statistic
							size="tiny"
							label="Following"
							value={userProfile?.following?.length!}
						/>
					</Statistic.Group>
					<Divider />
					{user?.username !== profileUser?.username && (
						<Reveal animated="move">
							<Reveal.Content visible style={{ width: "100%" }}>
								<Button
									fluid
									color="teal"
									content={
										isFollowing
											? "Following"
											: "Not following"
									}
								/>
							</Reveal.Content>
							<Reveal.Content hidden style={{ width: "100%" }}>
								<Button
									basic
									fluid
									color={isFollowing ? "red" : "green"}
									content={
										isFollowing ? "Unfollow" : "Follow"
									}
									loading={updateLoading}
									onClick={e =>
										handleFollowing(
											e,
											profileUser?.username!
										)
									}
								/>
							</Reveal.Content>
						</Reveal>
					)}
				</Grid.Column>
			</Grid>
		</Segment>
	)
})
