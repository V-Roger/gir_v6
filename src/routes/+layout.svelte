<script lang="ts">
	import '../app.css';
	import svgLogo from '../assets/logo_vroger.svg?raw';
	import { createRoutesTree, flattenRoutesTree } from './routes';

	import { page } from '$app/state';

	const routeDefinitions = import.meta.glob('./*/**/+page.svelte', {
		eager: true
	});

	const routesTree = createRoutesTree(routeDefinitions);
	const subRoutes = flattenRoutesTree(routesTree)
		.sort((a, b) => a.name.localeCompare(b.name))
		.sort((a, b) => a.depth - b.depth);

	const { children } = $props();
</script>

<div class="space-y-4 space-x-4 rounded-lg">
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
							'flex rounded-sm py-1 pr-4 hover:bg-black hover:text-white focus:bg-black focus:text-white dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black': true,
							'pl-4': route.depth === 0,
							'pl-8': route.depth === 1,
							'pl-12': route.depth === 2,
							'bg-black text-white dark:bg-white dark:text-black': route.href === page.url.pathname
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

		<section>
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
