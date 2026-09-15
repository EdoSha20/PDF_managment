import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
 
// Vite-Konfiguration für unser SvelteKit-Projekt.
// tailwindcss() aktiviert Tailwind CSS.
// sveltekit() aktiviert SvelteKit.
export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
});