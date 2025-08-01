<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	if (!data?.gallery || !data?.photos) {
		throw redirect(302, '/photos');
	}
</script>

<h1>{data.gallery.name}</h1>
<p>{data.gallery.description}</p>

<div class="flex flex-col items-end not-prose gap-4">
	{#if data.photos}
		{#each data.photos as photo}
			<img src={`/.netlify/images?url=${photo.path}`} alt={ photo.description ?? 'missing description' } class="object-contain max-w-full max-h-screen" />
		{/each}
	{:else}
		<p>Nothing to see here...</p>
	{/if}
</div>
