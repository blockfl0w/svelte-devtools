import componentTracker from './src/lib/vite-plugin-svelte-developerTools.js';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';

export default defineConfig({
	plugins: [sveltekit(), componentTracker(), svelteInspector()]
});
