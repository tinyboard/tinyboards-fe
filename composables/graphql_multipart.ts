/**
* GraphQL file upload according to specs: https://github.com/jaydenseric/graphql-multipart-request-spec
*
* This is not supported by `nuxt-graphql-client`, so it has its own composable.
*/
export async function useGqlMultipart(
	{
		query,
		variables = {},
		files = {}
	}: {
		query: string;
		variables: { [key: string]: any };
		files: { [key: string]: File };
	}) {
	const config = useRuntimeConfig();
	const tokenCookie = useCookie('token');

	// Build GraphQL endpoint
	const protocol = config.public.use_https ? 'https' : 'http';
	const domain = config.public.domain || 'localhost:8536';
	const endpoint = `${protocol}://${domain}/api/v2/graphql`;

	// Build FormData according to multipart spec
	const formData = new FormData();

	const cleanedQuery = query.replace(/\s+/g, ' ').trim();
	const operations = {
		query: cleanedQuery,
		variables
	};

	formData.append("operations", JSON.stringify(operations));

	// Build file map
	let i = 0;
	let fileMap: { [key: string]: [string] } = {};
	for (const [filename, file] of Object.entries(files)) {
		fileMap[i.toString()] = [`variables.${filename}`];
		// Per specs, each file needs its own field
		formData.append(i.toString(), file);
		i++;
	}

	formData.append("map", JSON.stringify(fileMap));

	// Prepare headers
	const headers: Record<string, string> = {};
	if (tokenCookie.value) {
		headers['Authorization'] = `Bearer ${tokenCookie.value}`;
	}

	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers,
			body: formData
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const result = await response.json();

		if (result.errors && result.errors.length > 0) {
			const error = new Error(result.errors[0].message || 'GraphQL Error');
			// @ts-ignore
			error.gqlErrors = result.errors;
			throw error;
		}

		return result;
	} catch (error) {
		if (process.dev) {
			console.error('GraphQL multipart upload error:', error);
		}
		throw error;
	}
}