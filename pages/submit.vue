<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<section class="flex flex-col">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-4xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<!-- Banner -->
				<CardsBanner
				title="Create new post"
				sub-title="Share a link, image or text with the community."
				image-url="https://i.imgur.com/4MvaMAI.jpg"
				class="col-span-full"
				/>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-4xl grid grid-cols-12 sm:px-4 sm:py-6 md:px-6">
			<div class="col-span-full flex flex-row gap-6">
				<!-- Form -->
				<form @submit.prevent="onSubmit" @submit="submit()" class="block w-full">
					<div class="bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
						<div v-if="!isEditingBoard" class="w-full p-4 bg-gray-50 border-b space-y-2 md:space-y-0 flex flex-col md:flex-row justify-center md:justify-between items-center">
							<div class="flex flex-row space-x-2 items-center">
								<img :src="dummyBoard.icon_url" class="hidden md:block w-11 h-11 object-cover p-0.5 border bg-white hover:bg-gray-200" alt="board icon"/>
								<div class="w-full text-center md:text-left">
									<p class="font-bold text-gray-700">You are posting to /b/{{ boardName }}</p>
									<p class="text-sm text-gray-500">Maybe board mods will be able to customze the text here later</p>
								</div>
							</div>
							<button class="button white" @click="isEditingBoard = true">
								Change board
							</button>
						</div>
						<div class="p-4 bg-white">
							<div class="grid grid-cols-6 gap-6">
								<!-- Board -->
								<div v-if="isEditingBoard" class="col-span-full">
									<label for="title" class="block text-sm font-bold">Board</label>
									<input type="text" name="title" id="title" placeholder="Enter board to post to, without the b/" class="mt-1 form-input gray" v-model="boardName" required/>
								</div>
								<!-- Title -->
								<div class="col-span-full">
									<label for="title" class="block text-sm font-bold">Title</label>
									<input type="text" name="title" id="title" placeholder="Pick an interesting title" class="mt-1 form-input gray" v-model="title" required/>
								</div>
								<!-- Link -->
								<div class="relative col-span-full">
									<label for="link">
										<span class="flex justify-between text-sm font-bold">
											Link
										</span>
										<input type="url" name="link" id="link" placeholder="https://youtube.com" class="peer mt-1 form-input gray" v-model="url" :required="!body && !image" @focus="hasFocusedUrl = true;"/>
										<p class="absolute right-0 mt-1 peer-invalid:visible invisible text-red-600 text-sm" :class="!body && !image && hasFocusedUrl ? 'opacity-100': 'opacity-0 pointer-events-none'">
											Please provide a valid URL.
										</p>
									</label>
								</div>
								<!-- Body -->
								<div class="relative col-span-full">
									<label for="body" class="flex justify-between text-sm font-bold">
										Body
										<em class="text-gray-400 font-normal">
											optional if you have a link or image
										</em>
									</label>
									<div id="post-body" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base">
										<!-- <InputsTiptap class="bg-white"/> -->
										<textarea placeholder="Enter some words worth reading..." class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" rows="6" v-model="body" :required="!url" @focus="hasFocusedBody = true;"/>
									</div>
									<p class="absolute right-0 mt-1 flex justify-end items-center text-xs text-gray-400">
										<svg xmlns="http://www.w3.org/2000/svg" class="mr-1 w-4 h-4" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										   <rect x="3" y="5" width="18" height="14" rx="2"></rect>
										   <path d="M7 15v-6l2 2l2 -2v6"></path>
										   <path d="M14 13l2 2l2 -2m-2 2v-6"></path>
										</svg>
										Markdown supported
									</p>
								</div>
								<!-- TO-DO: Media Preview -->
								<div class="col-span-full">
									<label for="title" class="block text-sm font-bold">Image</label>
									<div class="mt-2 flex items-center">
										<img v-if="image" :src="image" class="inline-block w-56 object-contain p-0.5 border bg-white mr-5" @click="preview"/>
										<div>
											<label v-if="!image" for="image-upload" class="inline-block button button-small gray cursor-pointer">
												Pick image
											</label>
											<button v-else class="button gray" @click="image = null;">
												<span class="text-red-500">Remove image</span>
											</button>
											<input id="image-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="onFileChange($event)"/>
											<small class="block mt-2 text-gray-400">
												PNG, JPG and GIF up to 1MB.
											</small>
										</div>
									</div>
								</div>
								<!-- Options -->
								<div class="col-span-full">
									<!-- NSFW Checkbox -->
									<ul class="flex flex-col space-y-2">
										<li class="flex">
											<div class="flex h-5 items-center">
												<input id="is_nsfw" name="is_nsfw" type="checkbox" v-model="isNsfw" class="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary">
											</div>
											<div class="ml-3 text-sm">
												<label for="is_nsfw" class="font-bold text-red-700 select-none">NFSW</label>
												<p class="text-gray-500">This post is for 18+ audiences</p>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="bg-gray-50 shadow-inner-white border-t p-4">
							<button type="submit" class="button primary">Create post</button>
						</div>
					</div>
				</form>
			</div>
		</section>
	</main>
</template>

<script setup>
	useHead({
		title: 'Tinyboards | create a post',
		meta: [
		{
			property: 'og:title',
			content: 'Tinyboards | create a post'
		}
		]
	});

	definePageMeta({
        'alias': ['','/b/:board?/submit'],
        'hasAuthRequired': true,
        'isDropzoneDisabled': true,
        key: (route) => route.fullPath
    });

	import { ref } from 'vue';
	import { baseURL } from "@/server/constants";
	import { useSiteStore } from '@/stores/StoreSite.js';
	import { useModalStore } from '@/stores/StoreModal';
	import { useToastStore } from '@/stores/StoreToast';

	const site = useSiteStore();

	const modal = useModalStore();
	const toast = useToastStore();

	const router = useRouter();
	const route = useRoute();

	const isEditingBoard = ref(false);

	const dummyBoard = {
            name: route.params.board,
            title: 'Board title, defaults to board name',
            description: 'Board short description, max 256 chars',
            followers_count: 304,
            posts_count: 1902,
            comments_count: 13929,
            created_at: '2022-11-27T19:31:27.730335',
            icon_url: 'https://i.ibb.co/r4D7WWs/scott-goodwill-y8-Ngwq34-Ak-unsplash.jpg',
            banner_url: 'https://i.ibb.co/7kfB6Y0/chris-schog-En-Ca-UE4-QNOw-unsplash.jpg'
      };

	const boardName = ref(dummyBoard.name ?? 'campfire');
	const title = ref(route.query.title);
	const url = ref(route.query.url);
	const image = ref(null);
	const body = ref(null);
	const isNsfw = ref(false);

	let hasFocusedUrl = ref(false);
	let hasFocusedBody = ref(false);

	// Set image and then destroy in storage.
	const setImage = () => {
		if (!!sessionStorage.getItem("image")) {
			image.value = sessionStorage.getItem("image");
			sessionStorage.removeItem("image");
		}
	};

	if (process.client) {
		setImage();
	};

	// File input
	const onFileChange = (e) => {
		const file = e.target.files[0];
		// Check for valid image file type and size
		if (/\.(jpe?g|png|gif)$/i.test(file.name) && file.size <= 1000000) {
			const reader = new FileReader();
			reader.onloadend = () => {
				image.value = reader.result;
				sessionStorage.removeItem("image");
			};
			reader.readAsDataURL(file);
		} else {
    		toast.addNotification({header:'Wrong format or size',message:'Try a PNG, JPG and GIF up to 1MB.',type:'error'});
    	};
	};

	// Image preview
	const preview = () => {
		if (!!image.value) {
			modal.setModal({
				modal: "ModalImage",
				id: 1,
				isOpen: true,
				options: {
					img: {
						'src': image.value,
						'alt': 'No alt text available.'
					}
				}
			});
		} else {
			console.error('No image to preview.')
		};
	};


	// Submit
	const authCookie = useCookie("token").value;

	const submit = () => {
		// Upload image and post otherwise just post
		if (!!image.value) {
			const images = [image.value];
			useFetch('/image', {
				baseURL,
				method: 'post',
				body: {
					"images": images
				},
				headers: {
					Authorization: authCookie ? `Bearer ${authCookie}` : '',
				}
			})
			.then(({ data, error }) => {
				if (data.value) {
					image.value = data.value.files[0].file;
					// On success, post
					post();
				} else {
					// Show error toast.
					toast.addNotification({
						header:'Failed to upload',
						message:'Your image failed to upload. Please try again.',
						type:'error',
						isVisibleOnRouteChange:true
					});
				}
			});
		} else {
			post();
		};
	};

	// Post
	const post = () => {
		return new Promise((resolve, reject) => {
			useFetch('/posts', {
				baseURL,
				method: "post",
				body: {
					"creatorId": 0,
					"boardId": 1,
					"title": title.value,
					"type_": "text",
					"url": url.value,
					"image": image.value,
					"body": body.value,
					"is_nsfw": isNsfw.value
				},
				headers: {
					Authorization: authCookie ? `Bearer ${authCookie}` : '',
				}
			})
			.then(({ data, error }) => {
				if (data.value) {
					const post = JSON.parse(JSON.stringify(data.value.post_view.post));
					// Show success toast.
					toast.addNotification({header:'Post created',message:'Your post was published!',type:'success',isVisibleOnRouteChange:true});
					// Navigate to thread page.
					navigateTo(`/post/${post.id}`);
				} else {
					// Show error toast.
					toast.addNotification({
						header:'Failed to post',
						message:'Your post failed to publish. Please try again.',
						type:'error',
						isVisibleOnRouteChange:true
					});
				};
			})
			.catch((error) => {
				console.log(error);
			});
		});
	};

	const links = [
	{ name: 'House Rules', href: '/help/rules', target: '_blank' },
	{ name: 'Formatting Guide', href: 'https://www.markdownguide.org/cheat-sheet/', target: '_blank', isExternal: true },
	];
</script>

<style scoped>
	#post-body {
		min-height: 8rem;
	}
</style>