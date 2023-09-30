import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),		
		SvelteKitPWA({
				srcDir: './src',
				mode: 'production',
				// you don't need to do this if you're using generateSW strategy in your app
				strategies: 'injectManifest',
				// you don't need to do this if you're using generateSW strategy in your app
				filename: 'prompt-sw.ts',
				scope: '/',
				base: '/',
				selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
				manifest: {
					short_name: 'Papaya Repartidor',
					name: 'Papaya Repartidor',
					start_url: '/',
					scope: '/',
					display: 'standalone',
					theme_color: "#00b14f",
					background_color: "#00b14f",
					icons: [
						{
							src: '/pwa-192x192.png',
							sizes: '192x192',
							type: 'image/png',
						},
						{
							src: '/pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png',
						},
						{
							src: '/pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any maskable',
						},
					],
				},
				injectManifest: {
					globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
				},
				workbox: {
					globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
				},
				devOptions: {
					enabled: true,
					suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
					type: 'module',
					navigateFallback: '/',
				},
				// if you have shared info in svelte config file put in a separate module and use it also here
				kit: {}
			}
		)
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	define: { 'process.env': {} }
});
