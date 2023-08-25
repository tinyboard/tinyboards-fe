export const canEmbedImage = link => {
	const config = useRuntimeConfig();

	// List of domains that can be embedded as images.
	// This will - eventually - hopefully be customizable by instance admins, but until then, here's a short, hardcoded list.
	// Feel free to expand it
	const approvedDomains = [
		config.public.domain,
		"i.redd.it",
		"i.imgur.com",
		"cdn.discordapp.com",
		"media.discordapp.net",
		"i.ibb.co"
	];

	const domain = link.split("/")[2];

	return /\.(jpe?g|png|gif)$/i.test(link) && approvedDomains.includes(domain);
};
