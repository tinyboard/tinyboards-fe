<template>
	<div class="bg-yellow-500 p-2 rounded">
		<div class="text-white flex flex-row justify-between">
			<div class="flex flex-row font-bold">
				<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-flag-3 my-[-1.5px] mr-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
				   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				   <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
				</svg>
				User Reports
			</div>
			<button @click="toggleOpen" class="flex flex-row">
				{{ open ? 'Close' : 'Expand' }}
				<svg v-if="open" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-diagonal-minimize-2 my-[-1.5px] ml-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
				   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				   <path d="M18 10h-4v-4"></path>
				   <path d="M20 4l-6 6"></path>
				   <path d="M6 14h4v4"></path>
				   <path d="M10 14l-6 6"></path>
				</svg>
				<svg v-else xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-diagonal my-[-1.5px] ml-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
				   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				   <path d="M16 4l4 0l0 4"></path>
				   <path d="M14 10l6 -6"></path>
				   <path d="M8 20l-4 0l0 -4"></path>
				   <path d="M4 20l6 -6"></path>
				</svg>
			</button>
		</div>
		<div v-if="open" class="bg-yellow-200 rounded my-1 divide-y">
			<div v-for="report in reports" :key="report.data.id" class="py-2 px-3">
				<p>
					<NuxtLink :to="`/@${report.creator.name}`">@{{ report.creator.name }}</NuxtLink>:
					{{ report.data.reason }}
				</p>
			</div>
		</div>
		<p v-if="open" class="text-sm text-gray-100 pt-1 px-2">Approving or removing this post will automatically resolve these reports.</p>
	</div>
</template>

<script setup>
	import { ref } from "vue";
	import { useApi } from "@/composables/api";

	const props = defineProps({
		type: {
			type: String,
			default: "post"
		},
		id: {
			type: Number,
			required: true
		}
	});

	const open = ref(false);
	const reports = ref([]);

	async function toggleOpen() {
		open.value = !open.value;
		if (reports.value.length === 0) {
			await useApi("/post/reports", {
				query: {
					post_id: props.id,
					unresolved_only: true
				}
			})
			.then(({ data, error }) => {
				if (data.value) {
					reports.value = data.value.post_reports;
				} else {
					console.log(error.value);
				}
			}) 
		}
	}
</script>
