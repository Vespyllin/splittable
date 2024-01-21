import adapter from '@sveltejs/adapter-node';
// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
		adapter: adapter(),
		alias: {
			'@/*': './src/lib/*'
		}
	}
};

export default config;
