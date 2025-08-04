<script lang="ts">
  import { onMount } from 'svelte'
  import { compile } from 'mdsvex'
  import bio from './bio.md?raw'
  import Loader from '$lib/components/filmLoader.svelte'

  let content = $state<string | undefined>(undefined)
  let meta = $state<
    | {
        exhibitions: { label: string; date: string; place: string }[]
        publications: { medium: string; date: string }[]
      }
    | undefined
  >(undefined)

  onMount(async () => {
    const result = await compile(bio)
    if (result) {
      content = result.code
      meta =
        (result.data?.fm as {
          exhibitions: { label: string; date: string; place: string }[]
          publications: { medium: string; date: string }[]
        }) || undefined
    }
  })
</script>

<h1>Virgil ROGER</h1>
{#if !content || !meta}
  <Loader />
{:else}
  <div class="content prose max-w-none dark:prose-invert">
    {@html content}
    <h2>Expositions</h2>
    <ul>
      {#each meta.exhibitions as exhibition}
        <li>
          <b>{exhibition.label}</b> /<br />
          <i>{exhibition.date}</i> &mdash; {exhibition.place}
        </li>
      {/each}
    </ul>
    <h2>Publications</h2>
    <ul>
      {#each meta.publications as publication}
        <li>
          <b>{publication.medium}</b> /<br />
          <i>{publication.date}</i>
        </li>
      {/each}
    </ul>
    <h2>Contact</h2>
    <div class="flex items-center gap-2">
      <a
        href="https://the.fotoapp.co/mr_sumatra"
        target="_blank"
        title="Virgil Roger sur Foto"
      >
        <img
          src="/foto.png"
          alt="Logo Foto"
          class="h-24 w-24 rounded-xs bg-black p-2 hover:invert"
        />
      </a>
      <a
        href="https://instagram.com/mr_sumatra"
        target="_blank"
        title="Virgil Roger sur Instagram"
      >
        <img
          src="/instagram.svg"
          alt="Logo Instagram"
          class="h-24 w-24 rounded-xs bg-black p-8 hover:invert"
        />
      </a>
    </div>
  </div>
{/if}
