import React, { useEffect, useState } from "react"
import { Button, Grid, Header, Image } from "semantic-ui-react"
import ImageWidgetCropper from "./ImageWidgetCropper"
import ImageWidgetDropzone from "./ImageWidgetDropzone"

interface Props {
	uploadImage: (file: Blob) => void
	deleteImage: (imageId: string) => void
	profilePicture: any
	loading: boolean
}

export default function ImageUploadWidget({
	uploadImage,
	deleteImage,
	profilePicture,
	loading,
}: Props) {
	const [images, setImages] = useState<any>([])
	const [cropper, setCropper] = useState<Cropper>()

	let onCrop = () => {
		if (cropper) {
			cropper.getCroppedCanvas().toBlob(blob => {
				uploadImage(blob!)
			})
		}
	}

	useEffect(() => {
		return () => {
			images.forEach((file: any) => URL.revokeObjectURL(file.preview))
		}
	}, [images])

	let [updateImage, setUpdateImage] = useState(false)

	const openUpdateImage = () => {
		setUpdateImage(!updateImage)
	}

	return (
		<Grid>
			<Grid.Row columns={3}>
				<Grid.Column />
				<Grid.Column textAlign="center">
					<Image
						size="medium"
						src={profilePicture?.url || "/assets/user.png"}
					/>
					<br />
					<Button.Group>
						<Button
							color={updateImage ? "grey" : "green"}
							content={updateImage ? "Cancel" : "Update"}
							onClick={e => openUpdateImage()}
						/>
						<Button.Or />
						<Button
							content="Remove"
							color="red"
							disabled={profilePicture?._id ? false : true}
							onClick={() => deleteImage(profilePicture?._id)}
						/>
					</Button.Group>
				</Grid.Column>
				<Grid.Column />
			</Grid.Row>
			{updateImage && (
				<Grid.Row columns={3}>
					<Grid.Column>
						<Header sub color="teal" content="Step 1 - Add photo" />
						<ImageWidgetDropzone setFiles={setImages} />
					</Grid.Column>
					<Grid.Column>
						<Header
							sub
							color="teal"
							content="Step 2 - Resize image"
						/>
						{images && images.length > 0 && (
							<ImageWidgetCropper
								setCropper={setCropper}
								imagePreview={images[0].preview}
							/>
						)}
					</Grid.Column>
					<Grid.Column>
						<Header
							sub
							color="teal"
							content="Step 3 - Review & upload"
						/>
						{images && images.length && (
							<>
								<div
									className="img-preview"
									style={{
										minHeight: 200,
										overflow: "hidden",
									}}
								/>
								<Button.Group widths={2} floated="right">
									<Button
										onClick={onCrop}
										positive
										loading={updateImage && loading}
										icon="check"
									/>
									<Button
										disabled={loading}
										onClick={() => setImages([])}
										icon="close"
									/>
								</Button.Group>
							</>
						)}
					</Grid.Column>
				</Grid.Row>
			)}
		</Grid>
	)
}
