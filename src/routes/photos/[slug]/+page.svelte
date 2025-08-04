<script lang="ts">
  import { redirect } from '@sveltejs/kit'
  import type { PageProps } from './$types'
  import Loader from '$lib/components/filmLoader.svelte'
  import IntersectionObserver from '$lib/components/intersectionObserver.svelte'
  import { onMount } from 'svelte'
  import { compile } from 'mdsvex'

  const { data }: PageProps = $props()

  if (!data?.gallery || !data?.photos) {
    throw redirect(302, '/photos')
  }

  let loadedImages = $state<string[]>([])
  let loadingImages = $state(new Set<string>())
  let description = $state('')
  let hasMarkdownDescription = $state(false)

  function handleImageLoad(photoPath: string) {
    loadedImages.push(photoPath)
    loadingImages.delete(photoPath)
  }

  function handleImageError(photoPath: string) {
    // Remove from loading even if there's an error
    loadingImages.delete(photoPath)
  }

  function startLoadingImage(photoPath: string) {
    if (!loadedImages.includes(photoPath)) {
      loadingImages.add(photoPath)
    }
  }

  function loadNextPhoto({ currentPhoto }: { currentPhoto: (typeof data.photos)[number] }) {
    const nextPhoto = data.photos[data.photos.findIndex((photo) => photo.path === currentPhoto.path) + 1]
    if (nextPhoto?.path) {
      startLoadingImage(nextPhoto.path)
    }
  }

  onMount(async () => {
    data.photos.slice(0, 5).forEach((photo) => {
      if (photo.path) {
        startLoadingImage(photo.path)
      }
    })

    if (data.gallery.description && data.gallery.description.startsWith('---')) {
      hasMarkdownDescription = true
      const result = await compile(data.gallery.description)
      if (result) {
        description = result.code
      }
    }
  })
</script>

<header class="max-h-[60vh] overflow-y-auto">
  <div class="rounded-sm bg-black/4 p-6 dark:bg-white/5 dark:prose-invert">
    {#if hasMarkdownDescription}
      {@html description}
    {:else}
      <h1>{data.gallery.name}</h1>
      <p>{data.gallery.description}</p>
    {/if}
  </div>
</header>

<div class="not-prose flex flex-col items-end gap-4">
  {#if data.photos}
    {#each data.photos as photo}
      {#if photo.path}
        {#if !loadedImages.includes(photo.path)}
          <Loader relative />
        {/if}
        <IntersectionObserver
          once
          intersect={() => loadNextPhoto({ currentPhoto: photo })}
        >
          <img
            src={`/.netlify/images?url=${photo.path}`}
            alt={photo.description ?? 'missing description'}
            onload={() => photo.path && handleImageLoad(photo.path)}
            onerror={() => photo.path && handleImageError(photo.path)}
            class:opacity-0={!loadedImages.includes(photo.path)}
            class="max-h-screen max-w-full object-contain"
            loading="lazy"
          />
        </IntersectionObserver>
      {/if}
    {/each}
  {:else}
    <p>Nothing to see here...</p>
  {/if}
</div>
