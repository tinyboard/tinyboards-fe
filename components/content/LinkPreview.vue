<!-- Embed Component -->
<!-- Displays web scraped details such as meta title, meta description, and website screenshot -->
<!-- Web scraping code can be found in submission.py -->

<template>
	<a :href="url" target="_blank" class="block border-l-3 border-primary rounded-l-sm">
		<div class="flex flex-grow justify-between p-2.5 sm:p-3 border border-gray-100 dark:border-transparent border-l-0 rounded-r bg-gray-50 dark:bg-gray-900 overflow-hidden">
			<div class="flex flex-col w-3/4 md:w-full" :class="title ? 'break-words' : 'break-all'">
				<small class="block text-sm text-gray-500 mb-2">
					<!-- Domain and Icon -->
					<i class="fa-sm text-gray-400" :class="icon[domain] || icon.normal"></i>
					{{ domain }}
				</small>
				<div>
					<!-- Meta Title -->
					<div class="text-base sm:text-lg text-primary font-medium leading-5 group-hover:text-opacity-90 mb-2 hover:underline">
						{{ title ? title : truncate(url, 72) }}
					</div>
					<!-- Meta Description -->
					<p class="text-sm text-gray-700 dark:text-gray-100">
						{{ preview ? truncate(preview, 72) : 'No link preview available :/' }}
					</p>
				</div>
			</div>
			<div class="flex-shrink-0 pl-3 md:pl-4">
				<!-- Thumbnail -->
				<img v-if="thumbnail" :src="thumbnail" class="w-14 md:w-20 h-14 flex-shrink-0 object-cover rounded-sm bg-gray-200 dark:bg-white dark:bg-opacity-20" alt="Link embed image"/>
				<!-- Fallback Icon -->
				<div v-else class="flex items-center justify-center w-14 md:w-20 h-14 flex-shrink-0 rounded-sm bg-gradient-to-br from-primary to-secondary">
					<i class="fas fa-link fa-lg text-white text-opacity-30"></i>
				</div>
			</div>
		</div>
	</a>
</template>

<script>
	export default {
		props: {
			thumbnail: String,
			domain: String,
			title: String,
			url: String,
			preview: String
		},
		data() {
			return {
				icon: { // object literal lookups, fallback icon is generic "earth"
					'github.com': 'fab fa-github',
					'reddit.com': 'fab fa-reddit-alien',
					'youtube.com': 'fab fa-youtube',
					'twitch.tv': 'fab fa-twitch',
					'dribbble.com': 'fab fa-dribbble',
					'discord.com': 'fab fa-discord',
					'discord.gg': 'fab fa-discord',
					'medium.com': 'fab fa-medium',
					'steam.com': 'fab fa-steam',
					'stackoverflow.com': 'fab fa-stack-overflow',
					'soundcloud.com': 'fab fa-soundcloud',
					'tumblr.com': 'fab fa-tumblr',
					'ycombinator.com': 'fab fa-y-combinator',
					normal: 'fas fa-globe-americas'
				}
			}
		},
		methods: {
			truncate(value, limit) { // truncate method
				if (value.length > limit) {
					value = value.substring(0, (limit - 3)) + '...';
				}

				return value
			}
		}
	};
</script>