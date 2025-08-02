<script lang="ts">
  import { redirect } from '@sveltejs/kit'
  import type { PageProps } from './$types'
  import { onMount } from 'svelte'
  import Loader from '$lib/components/loader.svelte'

  const { data }: PageProps = $props()

  if (!data?.gallery || !data?.photos) {
    throw redirect(302, '/photos')
  }

  let loadedImages = $state(new Set<string>())
  let loadingImages = $state(new Set<string>())
  let hasLoaded = $derived(loadingImages.size === 0)

  function handleImageLoad(photoPath: string) {
    loadedImages.add(photoPath)
    loadingImages.delete(photoPath)
  }

  function handleImageError(photoPath: string) {
    // Remove from loading even if there's an error
    loadingImages.delete(photoPath)
  }

  function startLoadingImage(photoPath: string) {
    if (!loadedImages.has(photoPath)) {
      loadingImages.add(photoPath)
    }
  }

  // Start loading all images immediately
  data.photos.forEach((photo) => {
    if (photo.path) {
      startLoadingImage(photo.path)
    }
  })
</script>

<h1>{data.gallery.name}</h1>
<p>{data.gallery.description}</p>

<div class="not-prose flex flex-col items-end gap-4">
  {#if data.photos}
    {#if hasLoaded}
      <Loader />
    {/if}
    {#each data.photos as photo}
      <img
        src={`/.netlify/images?url=${photo.path}`}
        alt={photo.description ?? 'missing description'}
        onload={() => photo.path && handleImageLoad(photo.path)}
        onerror={() => photo.path && handleImageError(photo.path)}
        class="max-h-screen max-w-full object-contain"
        loading="lazy"
      />
    {/each}
  {:else}
    <p>Nothing to see here...</p>
  {/if}
</div>
