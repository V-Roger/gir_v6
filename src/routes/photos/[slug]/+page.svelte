<script lang="ts">
  import { redirect } from '@sveltejs/kit'
  import type { PageProps } from './$types'

  const { data }: PageProps = $props()

  if (!data?.gallery || !data?.photos) {
    throw redirect(302, '/photos')
  }
</script>

<h1>{data.gallery.name}</h1>
<p>{data.gallery.description}</p>

<div class="not-prose flex flex-col items-end gap-4">
  {#if data.photos}
    {#each data.photos as photo}
      <img
        src={`/.netlify/images?url=${photo.path}`}
        alt={photo.description ?? 'missing description'}
        class="max-h-screen max-w-full object-contain"
      />
    {/each}
  {:else}
    <p>Nothing to see here...</p>
  {/if}
</div>
