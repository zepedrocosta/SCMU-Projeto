import { Button, Portal, Dialog, TextInput, IconButton } from "react-native-paper";
import { useUpdateUserInfo } from "../utils/services/UserService";

interface EditProfileModalProps {
	visible: boolean;
	onClose: () => void;
	name: string;
	setName: (name: string) => void;
	onSave: () => void;
}

export default function EditProfileModal({
	visible,
	onClose,
	name,
	setName,
	onSave,
}: EditProfileModalProps) {
	const { mutate } = useUpdateUserInfo();

	const handleSave = () => {
		mutate({ name });
		onSave();
	};

	return (
		<Portal>
			<Dialog visible={visible} onDismiss={onClose}>
				<Dialog.Title>
					Edit Profile
					<IconButton
						icon="close"
						size={20}
						style={{ position: "absolute", right: 0, top: 0 }}
						onPress={onClose}
					/>
				</Dialog.Title>
				<Dialog.Content>
					<TextInput
						label="Name"
						value={name}
						onChangeText={setName}
						mode="outlined"
						autoFocus
					/>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={onClose}>Cancel</Button>
					<Button onPress={handleSave}>Save</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
}
