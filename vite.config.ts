import componentTracker from './src/lib/vite-plugin-svelte-developerTools.js';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), componentTracker()]
});
