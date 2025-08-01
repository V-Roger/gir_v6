<script lang="ts">
	import '../app.css';
	import svgLogo from '../assets/logo_vroger.svg?raw';
	import { createRoutesTree, flattenRoutesTree } from './routing';

	import { page } from '$app/state';
	const { children, data } = $props();

	const routeDefinitions = import.meta.glob('./*/**/+page.svelte', {
		eager: true
	});

	const galleries = data.galleries;
	const galleryRoutesDefinitions = Object.fromEntries(
		galleries.map((gallery) => [`photos/${gallery.name}`, gallery.name])
	);
	console.log(galleryRoutesDefinitions);
	console.log(routeDefinitions);
	const routesTree = createRoutesTree({
		...routeDefinitions,
		...galleryRoutesDefinitions
	});

	const subRoutes = flattenRoutesTree(routesTree)
		.sort((a, b) => a.name.localeCompare(b.name))
		.sort((a, b) => a.depth - b.depth);

</script>

<div class="space-y-4 space-x-4 pb-4 rounded-lg">
	<div class="flex w-full rounded-lg">
		<header class="w-1/6">
			<a href="/" title="Accueil" class="flex w-full overflow-hidden rounded-lg">
				{@html svgLogo}
			</a>
		</header>
	</div>

	<div class="flex space-x-4">
		<aside class="sticky top-2 h-full max-h-full w-1/6 shrink-0 flex-col items-center">
			<nav class="flex w-full flex-col space-y-4">
				{#each subRoutes as route}
					<a
						href={route.href}
						class={{
							'flex prose prose-neutral rounded-sm py-1 pr-4 hover:bg-black focus:bg-black hover:prose-invert focus:prose-invert dark:hover:bg-white dark:focus:bg-white dark:prose-invert dark:focus:prose-neutral! dark:hover:prose-neutral!': true,
							'pl-4': route.depth === 0,
							'pl-8': route.depth === 1,
							'pl-12': route.depth === 2,
							'bg-black dark:bg-white prose-invert! dark:prose-neutral!': route.href === page.url.pathname
						}}
					>
						{#if route.depth === 0}
							{route.name} /
						{:else}
							/ {route.name}
						{/if}
					</a>
				{/each}
			</nav>
		</aside>

		<section class="max-w-full rounded-lg overflow-hidden space-y-4 prose prose-neutral dark:prose-invert">
			{@render children()}
		</section>
	</div>
</div>

<style>
	header {
		:global(svg) {
			width: 100%;
			height: 100%;
		}

		@media (prefers-color-scheme: dark) {
			& {
				:global(svg) {
					fill: var(--color-white);
				}

				:global(svg > polygon) {
					fill: black;
				}
			}
		}
	}
</style>
