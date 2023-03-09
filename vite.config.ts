import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			outDir: '.svelte-kit/output/client',
			registerType: 'autoUpdate',
			filename: 'service-worker.js',
			manifest: {
				theme_color: '#35def6',
				background_color: '#35def6',
				display: 'standalone',
				scope: '/',
				start_url: '/',
				name: 'doctowish-doctor',
				short_name: 'doctowish',
				icons: [
					{
						src: '/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icon-256x256.png',
						sizes: '256x256',
						type: 'image/png'
					},
					{
						src: '/icon-384x384.png',
						sizes: '384x384',
						type: 'image/png'
					},
					{
						src: '/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	]
});
