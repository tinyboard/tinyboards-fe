<template>
	<main class="flex pt-0 sm:pt-14">
		<!-- Main Content -->
		<section class="container mx-auto max-w-4xl grid grid-cols-12 sm:px-4 md:px-6">
			<div class="col-span-full flex flex-col gap-6 py-8 my-2.5 sm:my-0">
				<!-- Banner -->
				<div class="relative sm:rounded-md overflow-x-auto">
					<MediaBanner
					title="Create new post"
					sub-title="Your post will be visible to 456 members of foruhm.land"
					image-url="https://i.imgur.com/4MvaMAI.jpg"
					/>
				</div>
				<!-- Form -->
				<form action="#" method="POST" class="block w-full">
					<div class="overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
						<div class="bg-white p-4">
							<div class="grid grid-cols-6 gap-4">
								<!-- Title -->
								<div class="col-span-full">
									<label for="title" class="block text-sm font-bold">Title</label>
									<input type="text" name="title" id="title" placeholder="Pick an interesting title" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"/>
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
										<input type="url" name="link" id="link" placeholder="https://youtube.com" class="peer mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"/>
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
											<InputsTiptap class="bg-white"/>
										</div>
									</label>
								</div>
							</div>
						</div>
						<div class="bg-gray-50 shadow-inner-white border-t p-4 text-right">
							<button type="submit" class="button primary">Create post</button>
						</div>
					</div>
				</form>
			</div>
		</section>
	</main>
</template>

<style scoped>
	#post-body {
		min-height: 8rem;
	}
</style>