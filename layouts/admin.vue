<template>
	<main id="layout-admin" class="h-full grid grid-cols-1 md:grid-cols-12 pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<!--<section class="flex flex-col">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-4xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<-- Banner 
				<CardsBanner
				class="col-span-full"
				title="Admin Panel"
				sub-title="Manage your tinyboard."
				image-url="https://forum.porpl.net/image/51bc2d71-6c70-4add-a7b0-03fed9024fb6.webp"
				/>
			</div>
		</section>-->
		<!-- Navigation -->
		<section class="hidden md:block col-span-2 min-[2000px]:col-span-1 bg-white p-4">
			<p class="text-sm text-gray-500 uppercase px-4 font-bold">General</p>
			<ul class="flex flex-col z-10 text-sm overflow-y-auto pt-1">
				<li class="relative">
					<NuxtLink to="/admin/overview" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M3 17l6 -6l4 4l8 -8"></path>
							   <path d="M14 7l7 0l0 7"></path>
							</svg>
							Overview
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/settings" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1"></path>
							   <path d="M9 12l2 2l4 -4"></path>
							</svg>
							Branding
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/security" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
							   <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
							   <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
							</svg>
							Security
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/appearance" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25"></path>
							   <path d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
							   <path d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
							   <path d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
							</svg>
							Appearance
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/css" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M7 4a2 2 0 0 0 -2 2v3a2 3 0 0 1 -2 3a2 3 0 0 1 2 3v3a2 2 0 0 0 2 2"></path>
							   <path d="M17 4a2 2 0 0 1 2 2v3a2 3 0 0 0 2 3a2 3 0 0 0 -2 3v3a2 2 0 0 1 -2 2"></path>
							</svg>
							Stylesheet
						</a>
					</NuxtLink>
				</li>
			</ul>
			<p class="text-sm text-gray-500 uppercase px-4 pt-4 font-bold">Content</p>
			<ul class="flex flex-col z-10 text-sm overflow-y-auto pt-1">
				<li class="relative">
					<NuxtLink to="/admin/content" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
							   <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
							</svg>
							Content Settings
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/reports/posts" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
							</svg>
							Reported Posts
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/reports/comments" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"></path>
							   <path d="M12 8l0 3"></path>
							   <path d="M12 14l0 .01"></path>
							</svg>
							Reported Comments
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/removed/posts" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M4 7l16 0"></path>
							   <path d="M10 11l0 6"></path>
							   <path d="M14 11l0 6"></path>
							   <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
							   <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
							</svg>
							Removed Posts
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/removed/comments" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M8 9h1m4 0h3"></path>
							   <path d="M8 13h5"></path>
							   <path d="M8 4h10a3 3 0 0 1 3 3v8c0 .577 -.163 1.116 -.445 1.573m-2.555 1.427h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8c0 -1.085 .576 -2.036 1.439 -2.562"></path>
							   <path d="M3 3l18 18"></path>
							</svg>
							Removed Comments
						</a>
					</NuxtLink>
				</li>
			</ul>
			<p class="text-sm text-gray-500 uppercase px-4 pt-4 font-bold">Users</p>
			<ul class="flex flex-col z-10 text-sm overflow-y-auto pt-1">
				<li class="relative">
					<NuxtLink to="/admin/users" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
							   <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
							   <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
							   <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
							</svg>
							All Accounts
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/admins" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z"></path>
							</svg>
							Admins
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/bans" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M8.18 8.189a4.01 4.01 0 0 0 2.616 2.627m3.507 -.545a4 4 0 1 0 -5.59 -5.552"></path>
							   <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.412 0 .81 .062 1.183 .178m2.633 2.618c.12 .38 .184 .785 .184 1.204v2"></path>
							   <path d="M3 3l18 18"></path>
							</svg>
							Banned Users
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/applications" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
							   <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5"></path>
							   <path d="M19 22v.01"></path>
							   <path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path>
							</svg>
							Registration Applications
						</a>
					</NuxtLink>
				</li>
				<li class="relative">
					<NuxtLink to="/admin/invites" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 rounded-md font-bold" :class="isActive ? 'text-primary bg-primary bg-opacity-20 shadow-inner-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'">							
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M10 14l11 -11"></path>
							   <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
							</svg>
							Invites
						</a>
					</NuxtLink>
				</li>
			</ul>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto col-span-full md:col-span-10 min-[2000px]:col-span-11 sm:px-4 sm:py-6 md:px-6 overflow-y-auto">
			<div class="col-span-full flex flex-col gap-6 md:px-12">
				<!-- Settings -->
				<slot />
			</div>
		</section>
	</main>
</template>

<script setup>
	import { useSiteStore } from '@/stores/StoreSite';
	const route = useRoute();
	const site = useSiteStore();

	// useHead({
	// 	title: `${site.name} | Admin ${route.meta.title ?? 'overview'}`,
	// 	meta: [
	// 	{
	// 		property: 'og:title',
	// 		content: `${site.name} | Admin ${route.meta.title ?? 'overview'}`
	// 	}
	// 	]
	// });

	const links = [
		{ name: 'Overview', href: '/admin/overview' },
		{ name: 'Settings', href: '/admin/settings' },
		{ name: 'Mod Queue', href: '/admin/queue' },
		{ name: 'Users', href: '/admin/users' },
		{ name: 'Invites', href: '/admin/invites' }
		];
	</script>