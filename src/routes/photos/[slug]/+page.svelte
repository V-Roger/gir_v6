<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const { gallery, photos } = data;

	if (!gallery || !photos) {
		throw redirect(302, '/photos');
	}
</script>

<h1>{gallery.name}</h1>
<p>{gallery.description}</p>

<div class="flex flex-col gap-4">
	{#if photos}
		{#each photos as photo}
			<img src={photo.path} alt={ photo.description ?? 'missing description' } />
		{/each}
	{:else}
		<p>Nothing to see here...</p>
	{/if}
</div>
