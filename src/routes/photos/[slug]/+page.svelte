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
  let description = $state<string | undefined>(undefined)
  let hasMarkdownDescription = $state(false)
  let title = $state<string | undefined>(undefined)
  let exhibitions = $state<{ place: string; date: string; label: string }[]>([])

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
    hasMarkdownDescription = Boolean(data.gallery.description && data.gallery.description.startsWith('---'))
    data.photos.slice(0, 5).forEach((photo) => {
      if (photo.path) {
        startLoadingImage(photo.path)
      }
    })

    if (hasMarkdownDescription) {
      const result = await compile(data.gallery.description!)
      if (result) {
        description = result.code
        title = (result.data as { fm: { title: string } })?.fm?.title
        exhibitions =
          (result.data as { fm: { exhibitions: { place: string; date: string; label: string }[] } })?.fm?.exhibitions
          ?? []
      }
    }
  })
</script>

<header class="max-h-[60vh] overflow-y-auto">
  <div class="content rounded-sm bg-black/4 p-6 dark:bg-white/5 dark:prose-invert">
    {#if hasMarkdownDescription}
      {#if title}
        <h1>{title}</h1>
      {/if}
      {#if description}
        {@html description}
      {/if}
      {#if exhibitions.length > 0}
        <h2>Expositions</h2>
        <ul>
          {#each exhibitions as exhibition}
            <li>{exhibition.place} / <br /> <em>{exhibition.date}</em> <br /> <b>{exhibition.label}</b></li>
          {/each}
        </ul>
      {/if}
    {:else}
      <h1>{data.gallery.name}</h1>
      <p>{data.gallery.description}</p>
    {/if}
  </div>
</header>

<div class="not-prose flex w-full flex-col items-center gap-4">
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
            class:max-h-screen={loadedImages.includes(photo.path)}
            class="max-h-0 max-w-full object-contain"
            loading="lazy"
          />
        </IntersectionObserver>
      {/if}
    {/each}
  {:else}
    <p>Nothing to see here...</p>
  {/if}
</div>
