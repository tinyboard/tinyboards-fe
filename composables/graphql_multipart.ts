import { useAPI } from './api';

/**
* Graphql file upload according to specs: https://github.com/jaydenseric/graphql-multipart-request-spec
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
	const f = new FormData();

	const cleanedQuery = query.replace(/\s+/g, ' ').trim();
	const operations = {
		query: cleanedQuery,
		variables
	};

	f.append("operations", JSON.stringify(operations));

	// file map
	let i = 0;
	let fileMap: { [key: string]: [string] } = {};
	for (const [filename, file] of Object.entries(files)) {
		fileMap[i.toString()] = [`variables.${filename}`];

		// per specs, each file needs its own field
		f.append(i.toString(), file);
		i++;
	}

	f.append("map", JSON.stringify(fileMap));

	return useAPI('/graphql', {
		method: "POST",
		body: f,
		version: 2
	});
}