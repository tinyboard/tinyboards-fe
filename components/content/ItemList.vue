<template>
	<!-- Posts -->
	<div v-if="items.length" class="w-full space-y-2 md:space-y-4">
		<ContentItemCard v-for="item in items" :key="item" :item="item"/>
	</div>
</template>

<script setup>
// local state
const items = [
{
	id: 1,
	author: {
		username: 'tim_apple',
		avatarUrl: 'https://i.imgur.com/nzY5zAg.jpg'
	},
	type: 'link',
	url: '',
	permalink: '1',
	domain: 'reddit.com',
	title: "iOS 16 lets you customize your Lock Screen in fun new ways. Layer a photo to make it pop. Track your Activity rings. And see live updates from your favorite apps.",
	thumbUrl: 'https://i.imgur.com/IrvvcY2.jpeg'
},
{
	id: 2,
	author: {
		username: 'drumpf',
		avatarUrl: 'https://i.imgur.com/401QojU.gif?noredirect'
	},
	type: 'link',
	url: '',
	permalink: '2',
	domain: 'reddit.com',
	title: "To be blunt, people would vote for me. They just would. Why? Maybe because I'm so good looking.",
	thumbUrl: 'https://i.imgur.com/IrvvcY2.jpeg'
},
{
	id: 3,
	author: {
		username: 'elon',
		avatarUrl: 'https://i.imgur.com/svGJfRg.jpg'
	},
	type: 'link',
	url: '',
	permalink: '3',
	domain: 'reddit.com',
	title: 'Buying Twitter is an accelerant to creating X, the everything app',
	thumbUrl: 'https://i.imgur.com/IrvvcY2.jpeg'
},
{
	id: 4,
	author: {
		username: 'jackolatern',
		avatarUrl: 'https://media.tenor.com/bfeoTmST6nMAAAAC/pumpkin-head-cemetery.gif'
	},
	type: 'link',
	url: '',
	permalink: '4',
	domain: 'reddit.com',
	title: 'GTA Online Halloween Jack o\' Lantern Locations: How to get the Horror Pumpkin Mask and Pumpkin Tee',
	thumbUrl: 'https://i.imgur.com/IrvvcY2.jpeg'
}
]

// lifecycle hooks
onMounted(() => {
  console.log(items)
})
</script>