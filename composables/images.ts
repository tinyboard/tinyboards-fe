import { useImageStore } from '@/stores/StoreImages';
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from '@/stores/StoreToast';

const imageStore = useImageStore();
const modalStore = useModalStore();
const toast = useToastStore();

// Validate emoji image dimensions
const validateEmojiDimensions = (file: File): Promise<boolean> => {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			const width = img.width;
			const height = img.height;

			// Backend requires: min 8x8, max 512x512
			if (width < 8 || height < 8) {
				toast.addNotification({
					header: 'Image too small!',
					message: 'Emoji must be at least 8x8 pixels',
					type: 'error'
				});
				resolve(false);
				return;
			}

			if (width > 512 || height > 512) {
				toast.addNotification({
					header: 'Image too large!',
					message: 'Emoji must be no larger than 512x512 pixels',
					type: 'error'
				});
				resolve(false);
				return;
			}

			resolve(true);
		};

		img.onerror = () => {
			toast.addNotification({
				header: 'Invalid image!',
				message: 'Could not read image file',
				type: 'error'
			});
			resolve(false);
		};

		img.src = URL.createObjectURL(file);
	});
};

/**
 * Determine whether an image can be embedded.
 * 
 * IMPORTANT: ALWAYS call this function to check before embedding images from user-provided sources.
 * @param link Direct link to the image
 * @returns Whether the image is safe to embed
 */
export const canEmbedImage = (link: string): boolean => {
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

	return /\.(jpe?g|png|gif|webp)$/i.test(link) && approvedDomains.includes(domain);
};

/// Call this when the file of a file input changes. Sets the crop modal.
export const onFileChange = async (e: InputEvent, type: 'avatar' | 'default_avatar' | 'banner' | 'background' | 'emoji' | 'homepage_banner') => {
	const file = e.target!.files[0];

	// For emojis, use 5MB default (backend configurable limit)
	// For other types, keep existing limits
	const maxFileSize = type == "emoji" ? 5 * 1024 * 1024 : (type == "avatar" ? 2 * 1024 * 1024 : 5 * 1024 * 1024);

	if (file.size > maxFileSize) {
		const sizeText = type == "emoji" ? "5" : (type == "avatar" ? "2" : "5");
		toast.addNotification({ header: 'Your files are too large!', message: `Max size for ${type}s is ${sizeText}MB.`, type: 'error' });
		return;
	}

	// Backend requires minimum 100 bytes for emojis
	if (type === "emoji" && file.size < 100) {
		toast.addNotification({
			header: 'File too small!',
			message: 'Emoji file appears to be corrupted or too small (minimum 100 bytes).',
			type: 'error'
		});
		return;
	}

	// Validate emoji dimensions before processing
	if (type === "emoji") {
		const isValid = await validateEmojiDimensions(file);
		if (!isValid) {
			return;
		}
	}

	// cropping modal butchers the gif, so we skip it
	// also skip cropper for profile background
	if (type === "background" || (file.name.toLowerCase().split('.').pop() === "gif")) {
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
					case 'emoji':
						imageStore.setEmoji(reader.result);
						break;
					case 'homepage_banner':
						imageStore.setHomepageBanner(reader.result);
						break;
					default:
						if (process.dev) console.error(`unexpected file type ${type}`);
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
export const uploadFile = async (file: File, type: string) => {
	const maxFileSize = type == "avatar" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;

	if (file.size > maxFileSize) {
		toast.addNotification({ header: 'Your files are too large!', message: `Max size for ${type}s is ${type == 'avatar' ? 2 : 5}MB.`, type: 'error' });
		throw new Error("enormous file");
	}

	let formData = new FormData();
	formData.append('file', file);

	const { data, pending, error, refresh } = await useAPI("/file/upload", {
		method: "put",
		body: formData
	});

	if (data.value?.uploads?.length > 0) {
		return data.value.uploads[0];
	} else if (error.value?.statusCode == 413) {
		toast.addNotification({ header: 'Your files are too large!', message: 'Your file is over 25MB!! How did you bypass the previous checks?', type: 'error' });

		throw new Error(error.value);
	} else {
		// Show error toast.
		toast.addNotification({ header: 'Upload failed', message: 'Failed to upload image :(', type: 'error' });
		// Log the error.
		if (process.dev) console.error(error.value);

		throw new Error(error.value);
	}
};
