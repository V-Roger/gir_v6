<script lang="ts">
	import '../app.css';
	import svgLogo from '../../static/assets/logo_vroger.svg?raw';

	let { children } = $props();
</script>

<aside
	class="mr-2 flex h-full w-1/6 flex-col items-center space-y-10 rounded-lg border border-green-500 p-2"
>
	<header class="w-full max-w-full">
		<a href="/" title="Accueil" class="flex w-full">
			{@html svgLogo}
		</a>
	</header>

	<nav class="flex grow flex-col items-center">
		<a href="/">Home</a>
		<a href="/bio">Bio</a>
	</nav>
</aside>

<section class="flex h-full w-5/6 rounded-lg border border-yellow-500 p-2">
	{@render children()}
</section>

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
