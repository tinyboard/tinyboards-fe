<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<section class="flex flex-col">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-4xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<!-- Banner -->
				<MediaBanner
				title="Create new post"
				:sub-title="`Your post will be visible to 456 members of ${site.name}.`"
				image-url="https://i.imgur.com/4MvaMAI.jpg"
				class="col-span-full"
				/>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-4xl grid grid-cols-12 sm:px-4 sm:py-6 md:px-6">
			<div class="col-span-full flex flex-col gap-6">
				<!-- Form -->
				<form action="/submit" @submit.prevent="submit" class="block w-full">
					<div class="overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
						<div class="bg-white px-4 py-5 sm:p-6">
							<div class="grid grid-cols-6 gap-4">
								<!-- Title -->
								<div class="col-span-full">
									<label for="title" class="block text-sm font-bold">Title</label>
									<input type="text" name="title" id="title" placeholder="Pick an interesting title" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" v-model="title"/>
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
										<input type="url" name="link" id="link" placeholder="https://youtube.com" class="peer mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" v-model="url"/>
										<p class="mt-2 invisible peer-invalid:visible text-red-600 text-sm">
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
											<textarea class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" rows="6" v-model="body"/>
										</div>
									</label>
								</div>
							</div>
						</div>
						<div class="bg-gray-50 shadow-inner-white border-t p-4 sm:px-6">
							<button type="submit" class="button primary">Create post</button>
						</div>
					</div>
				</form>
			</div>
		</section>
	</main>
</template>

<script setup>
	import { baseURL } from "@/server/constants";
	import { useSiteStore } from '@/stores/StoreSite.js'

	const site = useSiteStore();

	let router = useRouter();

	let title = ref("");
	let url = ref("");
	let body = ref("");

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
					"nsfw": true
				},
				headers: {
					Authorization: authCookie ? `Bearer ${authCookie}` : '',
				}
			})
			.then(({ data }) => {
				const post = JSON.parse(JSON.stringify(data.value.post_view.post));
				navigateTo(`/post/${post.id}`)
			})
			.catch((error) => {
				console.log(error);
			});
		});
	};

	const links = [
	{ name: 'House Rules', href: '/wiki/rules', target: '_blank' },
	{ name: 'Formatting Guide', href: '/wiki/formatting', target: '_blank' },
	];
</script>

<style scoped>
	#post-body {
		min-height: 8rem;
	}
</style>