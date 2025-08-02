<script lang="ts">
  let { data } = $props()
</script>

<ul class="grid list-none grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {#each data.galleries as gallery}
    <li>
      <a href={`/photos/${gallery.slug}`}>
        {#if gallery?.cover?.path}
          <img
            src={gallery.cover.path}
            alt={gallery.name}
            class="aspect-square w-full rounded-lg object-cover transition-all duration-120 hover:opacity-70"
          />
        {/if}
        <p class="mt-2 text-center">{gallery.name}</p>
      </a>
    </li>
  {/each}
</ul>
