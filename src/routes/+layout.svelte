<script lang="ts">
  import '../app.css'
  import svgLogo from '../assets/logo_vroger.svg?raw'
  import { createRoutesTree, flattenRoutesTree } from '$lib/routing'
  import { innerWidth } from 'svelte/reactivity/window'
  import { page } from '$app/state'
  import { afterNavigate, beforeNavigate } from '$app/navigation'
  import Loader from '$lib/components/filmLoader.svelte'

  const { children, data } = $props()

  const routeDefinitions = import.meta.glob('./*/**/+page.svelte', { eager: true }) as Record<string, { path: string }>

  const galleries = data.galleries
  const galleryRoutesDefinitions = Object.fromEntries(
    galleries.map((gallery) => [
      `photos/${gallery.slug}`,
      { slug: gallery.slug, path: gallery.slug, name: gallery.name },
    ]),
  ) as Record<string, { slug?: string; path: string; name?: string }> | undefined

  const routesTree = createRoutesTree({ ...routeDefinitions, ...galleryRoutesDefinitions })

  const subRoutes = flattenRoutesTree(routesTree)
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => a.depth - b.depth)
    .concat([
      { href: 'https://shop.virgil-roger.photography', name: 'Boutique', path: 'boutique', depth: 0, target: '_blank' },
    ])

  const isTooSmall = $derived(innerWidth?.current && innerWidth.current < 1280)
  let isMenuActive = $state(false)
  let loading = $state(false)

  function toggleMenu(force?: boolean) {
    isMenuActive = force ?? !isMenuActive
  }

  beforeNavigate(() => {
    loading = true
  })

  afterNavigate(() => {
    loading = false
  })
</script>

<div class="space-y-4 space-x-4 rounded-sm pb-4">
  <div class="flex w-full rounded-sm">
    <header class="w-1/6">
      <a
        href="/"
        title="Accueil"
        class="flex w-full overflow-hidden rounded-xs xl:rounded-sm"
      >
        {@html svgLogo}
      </a>
      {#if isTooSmall}
        <button
          class="active:color-white dark:active:color-black! fixed top-4 right-4 rounded-xs p-1 transition-all hover:bg-black hover:text-white focus:bg-black focus:text-white dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black!"
          onclick={() => toggleMenu()}
          aria-label="Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
            />
            <line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
            />
            <line
              x1="3"
              y1="18"
              x2="21"
              y2="18"
            />
          </svg>
        </button>
      {/if}
    </header>
  </div>

  <div
    class="flex"
    class:space-x-4={!isTooSmall}
  >
    <aside
      class="sticky top-2 h-full max-h-full w-full shrink-0 flex-col items-center transition-all duration-200 ease-out xl:w-1/6"
      class:go-away={isTooSmall && !isMenuActive}
    >
      <nav class="flex w-full flex-col space-y-4">
        {#each subRoutes as route}
          <a
            href={route.href}
            class={{
              'prose flex rounded-xs py-1 pr-4 prose-neutral hover:bg-black hover:prose-invert focus:bg-black focus:prose-invert dark:prose-invert dark:hover:bg-white dark:hover:prose-neutral! dark:focus:bg-white dark:focus:prose-neutral!': true,
              'pl-4': route.depth === 0,
              'pl-8': route.depth === 1,
              'pl-12': route.depth === 2,
              'bg-black prose-invert! dark:bg-white dark:prose-neutral!': route.href === page.url.pathname,
            }}
            target={route.target ?? undefined}
            onclick={() => toggleMenu(false)}
            data-sveltekit-preload-data="hover"
            data-sveltekit-preload-code="eager"
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

    <section
      class="prose w-full max-w-full space-y-4 overflow-hidden rounded-sm prose-neutral dark:prose-invert"
      class:hidden={isTooSmall && isMenuActive}
    >
      {#if loading}
        <Loader />
      {:else}
        {@render children()}
      {/if}
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

  .go-away {
    transform: translateX(-100%);
    margin-left: -100%;
  }
</style>
