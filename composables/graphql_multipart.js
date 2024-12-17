import { useAPI } from './api';

/*
 * Graphql file upload according to specs: https://github.com/jaydenseric/graphql-multipart-request-spec
 * 
 * This is not supported by `nuxt-graphql-client`, so it has its own composable.
 */

export async function useGqlMultipart({query, variables = {}, files = {}}) {
	const f = new FormData();

	f.append("operations", JSON.stringify({
		query: query.replace('\t', '').replace('\n', ''),
		variables
	}));

	// file map
	let i = 0;
	let fileMap = {};
	for (const [filename, file] of Object.entries(files)) {
		fileMap[i.toString()] = [`variables.${filename}`];

		// per specs, each file needs its own field
		f.append(i, file);
		i ++;
	}
	f.append("map", JSON.stringify(fileMap));
	
	return useAPI('/graphql', {
		method: "POST",
		body: f,
		version: 2
	});
}