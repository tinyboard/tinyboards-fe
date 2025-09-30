<template>
	<NuxtLayout name="error">
		<div class="flex flex-col items-center justify-center space-y-4">
			<!-- User-Friendly Error -->
			<div class="p-4 bg-white border rounded-md shadow-inner-white max-w-2xl w-full">
				<div class="flex items-center space-x-2">
					<h1 class="text-2xl md:text-4xl leading-normal font-bold dark:text-gray-100">
						{{ error.statusCode }}
					</h1>
					<h1 class="text-xl md:text-3xl leading-normal font-bold text-gray-600 dark:text-gray-300">
						{{ errorCodes[error.statusCode] || "" }}
					</h1>
				</div>
				<hr class="my-2" />
				<p class="text-gray-600">
					{{ error.statusMessage }}
				</p>
				<ul v-if="error.statusCode != 502" class="mt-2 pl-4 flex flex-col list-disc">
					<li>
						<NuxtLink @click="router.go(-1)" to="#">Go back</NuxtLink>
					</li>
					<li>
						<NuxtLink external to="/feed">Go to home</NuxtLink>
					</li>
					<li v-if="isDev && hasErrorDetails">
						<button @click="showDetails = !showDetails" class="text-primary underline hover:no-underline">
							{{ showDetails ? 'Hide' : 'Show' }} error details
						</button>
					</li>
				</ul>
			</div>

			<!-- Developer Error Details (Dev Mode Only) -->
			<div v-if="isDev && showDetails && hasErrorDetails" class="p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded-md shadow-lg max-w-4xl w-full font-mono text-sm overflow-auto max-h-[600px]">
				<div class="space-y-4">
					<!-- GraphQL Errors -->
					<div v-if="graphqlErrors && graphqlErrors.length > 0">
						<h2 class="text-lg font-bold text-red-400 mb-2">GraphQL Errors ({{ graphqlErrors.length }})</h2>
						<div v-for="(err, index) in graphqlErrors" :key="index" class="mb-4 p-3 bg-gray-800 rounded border border-red-500/30">
							<div class="space-y-2">
								<p class="text-red-300 font-semibold">Error {{ index + 1 }}: {{ err.message }}</p>
								<div v-if="err.path" class="text-xs">
									<span class="text-gray-400">Path:</span>
									<span class="text-yellow-300 ml-2">{{ formatPath(err.path) }}</span>
								</div>
								<div v-if="err.locations && err.locations.length > 0" class="text-xs">
									<span class="text-gray-400">Location:</span>
									<span class="text-blue-300 ml-2">Line {{ err.locations[0].line }}, Column {{ err.locations[0].column }}</span>
								</div>
								<div v-if="err.extensions" class="text-xs">
									<span class="text-gray-400">Extensions:</span>
									<pre class="mt-1 p-2 bg-gray-950 rounded overflow-x-auto">{{ JSON.stringify(err.extensions, null, 2) }}</pre>
								</div>
							</div>
						</div>
					</div>

					<!-- Stack Trace -->
					<div v-if="error.stack">
						<h2 class="text-lg font-bold text-orange-400 mb-2">Stack Trace</h2>
						<pre class="p-3 bg-gray-800 rounded border border-orange-500/30 overflow-x-auto text-xs">{{ error.stack }}</pre>
					</div>

					<!-- Error Data -->
					<div v-if="error.data">
						<h2 class="text-lg font-bold text-blue-400 mb-2">Additional Data</h2>
						<pre class="p-3 bg-gray-800 rounded border border-blue-500/30 overflow-x-auto text-xs">{{ JSON.stringify(error.data, null, 2) }}</pre>
					</div>

					<!-- Copy Error Info Button -->
					<div class="flex items-center space-x-2 pt-2 border-t border-gray-700">
						<button
							@click="copyErrorInfo"
							class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition"
						>
							{{ copied ? '✓ Copied!' : 'Copy Error Information' }}
						</button>
						<span class="text-xs text-gray-400">{{ new Date().toISOString() }}</span>
					</div>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({ error: Object });
const router = useRouter();
const config = useRuntimeConfig();

const showDetails = ref(false);
const copied = ref(false);

// Check if in development mode
const isDev = computed(() => process.dev);

// Extract GraphQL errors
const graphqlErrors = computed(() => {
	return (props.error as any)?.gqlErrors || (props.error as any)?.graphQLErrors || [];
});

// Check if error has details worth showing
const hasErrorDetails = computed(() => {
	return graphqlErrors.value.length > 0 || props.error?.stack || props.error?.data;
});

// Format GraphQL path array
const formatPath = (path: any[]) => {
	return path.join(' → ');
};

// Copy error information to clipboard
const copyErrorInfo = async () => {
	const errorInfo = {
		statusCode: props.error?.statusCode,
		statusMessage: props.error?.statusMessage,
		graphqlErrors: graphqlErrors.value,
		stack: props.error?.stack,
		data: props.error?.data,
		timestamp: new Date().toISOString()
	};

	try {
		await navigator.clipboard.writeText(JSON.stringify(errorInfo, null, 2));
		copied.value = true;
		setTimeout(() => {
			copied.value = false;
		}, 2000);
	} catch (err) {
		console.error('Failed to copy:', err);
	}
};

useHead({
	title: `${props.error?.statusCode} ${errorCodes[props.error?.statusCode] || "Error"}`
});

const errorCodes = {
	400: "Bad request",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not found",
	500: "Internal server error",
	502: "Bad Gateway"
}
</script>