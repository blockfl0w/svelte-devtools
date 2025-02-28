import componentTracker from './src/lib/vite-plugin-svelte-components.js';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), componentTracker()]
});
