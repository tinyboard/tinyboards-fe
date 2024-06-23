<template>
	<div class="fixed top-14 left-0 bg-white border-r border-gray-200 h-screen hidden md:flex flex-col items-center w-20 py-4 md:z-50">
		<div class="flex flex-col space-y-2">
			<NuxtLink to="/feed" custom v-slot="{isActive, navigate}">
				<button class="relative flex group border p-[1px] transition-all duration-100" :class="[isActive ? 'bg-primary border-primary text-primary' : 'bg-white border-gray-300 text-gray-300 hover:bg-primary/70 hover:text-primary/70']" @click="() => navigate('/feed')">
					<div class="my-auto mx-auto w-12 h-12 bg-white text-center flex justify-center items-center">
						<svg  xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 inline-block"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
						</svg>
					</div>
					<div class="absolute mx-2 p-2 w-auto min-w-max left-16 rounded-md shadow-md bg-white text-sm transition-all duration-100 scale-0 group-hover:scale-100 origin-left">
						<div class="flex flex-row space-x-2 items-center">
							<div class="w-12 h-12 bg-white flex justify-center items-center border p-[1px] text-gray-300 border-gray-300">
								<svg  xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 inline-block"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
								</svg>
							</div>
							<div class="text-left">
								<h3 class="font-semibold text-gray-800">Home</h3>
								<p class="text-gray-600">Your own home feed.</p>
							</div>
						</div>
					</div>
				</button>
			</NuxtLink>
			<NuxtLink to="/all" custom v-slot="{isActive, navigate}">
				<button class="relative flex group border p-[1px] transition-all duration-100" :class="[isActive ? 'bg-primary border-primary text-primary' : 'bg-white border-gray-300 text-gray-300 hover:bg-primary/70 hover:text-primary/70']" @click="() => navigate('/all')">
					<div class="my-auto mx-auto w-12 h-12 bg-white text-center flex justify-center items-center">
						<svg  xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 inline-block"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg>
					</div>
					<div class="absolute mx-2 p-2 w-auto min-w-max left-16 rounded-md shadow-md bg-white text-sm transition-all duration-100 scale-0 group-hover:scale-100 origin-left">
						<div class="flex flex-row space-x-2 items-center">
							<div class="w-12 h-12 bg-white flex justify-center items-center border p-[1px] text-gray-300 border-gray-300">
								<svg  xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 inline-block"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg>
							</div>
							<div class="text-left">
								<h3 class="font-semibold text-gray-800">All Posts</h3>
								<p class="text-gray-600">All posts from all boards.</p>
							</div>
						</div>
					</div>
				</button>
			</NuxtLink>
		</div>
	</div>
</template>