<template>
	<div class="bg-yellow-400 bg-opacity-60 p-2 rounded">
		<div class="text-gray-600 text-sm flex flex-row justify-between">
			<div class="flex flex-row font-bold text-orange-700">
				<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-flag-3-filled my-[-3px] mr-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
				   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				   <path d="M19 4c.852 0 1.297 .986 .783 1.623l-.076 .084l-3.792 3.793l3.792 3.793c.603 .602 .22 1.614 -.593 1.701l-.114 .006h-13v6a1 1 0 0 1 -.883 .993l-.117 .007a1 1 0 0 1 -.993 -.883l-.007 -.117v-16a1 1 0 0 1 .883 -.993l.117 -.007h14z" stroke-width="0" fill="currentColor"></path>
				</svg>
				User Reports
			</div>
			<button @click.prevent="toggleOpen" class="flex flex-row">
				{{ open ? 'Close' : 'Expand' }}
				<svg v-if="open" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-diagonal-minimize-2 my-[-3px] ml-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
		<p v-if="open" class="text-sm text-gray-600 pt-1 px-2">Approving or removing this {{ type }} will automatically resolve these reports.</p>
	</div>
</template>

<script setup>
	import { ref } from "vue";
	import { useGraphQLQuery } from "@/composables/useGraphQL";

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
			try {
				const query_str = `
					query GetReports($type: String!, $targetId: Int!, $unresolvedOnly: Boolean!) {
						getReports(type: $type, targetId: $targetId, unresolvedOnly: $unresolvedOnly) {
							id
							reason
							resolved
							createdAt
							reporter {
								id
								name
								displayName
								avatar
							}
							target {
								id
								title
								content
							}
						}
					}
				`;

				const { data: result } = await useGraphQLQuery(query_str, {
					variables: {
						type: props.type,
						targetId: props.id,
						unresolvedOnly: true
					}
				});

				if (result.value?.getReports) {
					reports.value = result.value.getReports.map(report => ({
						data: {
							id: report.id,
							reason: report.reason
						},
						creator: report.createdBy
					}));
				}
			} catch (error) {
				console.error('Error fetching reports:', error);
			}
		}
	}
</script>
