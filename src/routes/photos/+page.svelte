<script lang="ts">
  let { data } = $props()
</script>

<ul class="grid list-none grid-cols-1 gap-4 pl-0! md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {#each data.galleries as gallery}
    <li class="flex flex-col items-start justify-start rounded-lg bg-black p-2 dark:bg-white">
      <a href={`/photos/${gallery.slug}`}>
        {#if gallery?.cover?.path}
          <img
            src={gallery.cover.path}
            alt={gallery.name}
            class="my-0! aspect-square w-full rounded-sm object-cover transition-all duration-120 hover:opacity-70"
          />
        {/if}
        <p class="mt-4 text-center text-white dark:text-black">{gallery.name}</p>
      </a>
    </li>
  {/each}
</ul>
