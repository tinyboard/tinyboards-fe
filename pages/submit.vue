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
			<div class="col-span-full flex flex-col gap-6">
				<!-- Form -->
				<form @submit.prevent="onSubmit" @submit="submit()" class="block w-full">
					<div class="overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
						<div class="bg-white p-4">
							<div class="grid grid-cols-6 gap-4">
								<!-- Title -->
								<div class="col-span-full">
									<label for="title" class="block text-sm font-bold">Title</label>
									<input type="text" name="title" id="title" placeholder="Pick an interesting title" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" v-model="title" required/>
								</div>
								<!-- Link -->
								<div class="col-span-full">
									<label for="link">
										<span class="flex justify-between text-sm font-bold">
											Link
											<em class="text-gray-400 font-normal">
												optional
											</em>
										</span>
										<input type="url" name="link" id="link" placeholder="https://youtube.com" class="peer mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" v-model="url" :required="!body" @focus="hasFocusedUrl = true;"/>
										<p class="mt-2 peer-invalid:visible invisible text-red-600 text-sm" :class="!body && hasFocusedUrl ? 'opacity-100': 'opacity-0 pointer-events-none'">
											Please provide a valid URL.
										</p>
									</label>
								</div>
								<!-- TO-DO: Media Preview -->
								<!-- Body -->
								<div class="col-span-full">
									<label for="body">
										<span class="flex justify-between text-sm font-bold">
											Body
											<em class="text-gray-400 font-normal">
												optional if you have a link
											</em>
										</span>
										<div id="post-body" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base">
											<!-- <InputsTiptap class="bg-white"/> -->
											<textarea placeholder="Enter some words worth reading..." class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" rows="6" v-model="body" :required="!url" @focus="hasFocusedBody = true;"/>
										</div>
									</label>
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
		title: 'TinyBoards | Create a Post',
		meta: [
		{
			property: 'og:title',
			content: 'TinyBoards | Create a Post'
		}
		]
	});

	import { ref } from 'vue';
	import { baseURL } from "@/server/constants";
	import { useSiteStore } from '@/stores/StoreSite.js'
	import { useToastStore } from '@/stores/StoreToast';

	const site = useSiteStore();

	const toast = useToastStore();

	const router = useRouter();

	const title = ref("");
	const url = ref("");
	const body = ref("");
	const isNsfw = ref(false);

	let hasFocusedUrl = ref(false);
	let hasFocusedBody = ref(false);

	const authCookie = useCookie("token").value;

	const submit = () => {
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