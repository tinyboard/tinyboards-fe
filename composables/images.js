import { useAPI } from "@/composables/api";
import { useImageStore } from '@/stores/StoreImages';
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from '@/stores/StoreToast';

const imageStore = useImageStore();
const modalStore = useModalStore();
const toast = useToastStore();

export const canEmbedImage = link => {
	const config = useRuntimeConfig();

	// List of domains that can be embedded as images.
	// This will - eventually - hopefully be customizable by instance admins, but until then, here's a short, hardcoded list.
	// Feel free to expand it
	const approvedDomains = [
		config.public.domain,
		"i.redd.it",
		"i.imgur.com",
		"cdn.discordapp.com",
		"media.discordapp.net",
		"i.ibb.co"
		];

	const domain = link.split("/")[2];

	return /\.(jpe?g|png|gif)$/i.test(link) && approvedDomains.includes(domain);
};

/// Call this when the file of a file input changes. Sets the crop modal.
export const onFileChange = (e,type) => {
	const file = e.target.files[0];

	const maxFileSize = type == "avatar" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;

	if (file.size > maxFileSize) {
		toast.addNotification({header:'Your files are too large!',message:`Max size for ${type}s is ${type == 'avatar' ? 2 : 5}MB.`, type:'error'});
		return;
	}

	// cropping modal butchers the gif, so we skip it
	// also skip cropper for profile background
	if (type === "background" ||(file.name.toLowerCase().split('.').pop() === "gif")) {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener(
			"load",
			() => {
				switch (type) {
					case 'avatar':
						imageStore.setAvatar(reader.result);
						break;
					case 'default_avatar':
						imageStore.setDefaultAvatar(reader.result);
						break;
					case 'background':
						imageStore.setBackground(reader.result);
						break;
					case 'banner':
						imageStore.setBanner(reader.result);
						break;
					default:
						console.error(`unexpected file type ${type}`);
				}
				/*if (type === "avatar") {
					imageStore.setAvatar(reader.result);
				} else if (type === "default_avatar") {
					imageStore.setDefaultAvatar(reader.result);
				} else if (type )
				 else {
					imageStore.setBanner(reader.result);
				}*/
			},
			false
			);

		return;
	}

	modalStore.setModal({
		modal: "ModalCrop",
		id: 0,
		contentType: type,
		isOpen: true,
		options: {
			image: URL.createObjectURL(file)
		}
	});
};


/// Upload a file to the server, and return the link to the file.
export const uploadFile = async (file, type) => {
	const maxFileSize = type == "avatar" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;

	if (file.size > maxFileSize) {
		toast.addNotification({header:'Your files are too large!',message:`Max size for ${type}s is ${type == 'avatar' ? 2 : 5}MB.`, type:'error'});
		throw new Error("enormous file");
	}

	let formData = new FormData();
	formData.append('file', file);

	const { data, pending, error, refresh } = await useAPI("/file/upload", {
		method: "put",
		body: formData
	});

	if (data.value.uploads.length > 0) {
		return data.value.uploads[0];
	} else if (error.value.statusCode == 413) {
		toast.addNotification({header:'Your files are too large!',message:'Your file is over 25MB!! How did you bypass the previous checks?',type:'error'});

		throw new Error(error.value);
	} else {
    		// Show error toast.
		toast.addNotification({header:'Upload failed',message:'Failed to upload image :(',type:'error'});
    		// Log the error.
		console.error(error.value);	

		throw new Error(error.value);
	}
};
