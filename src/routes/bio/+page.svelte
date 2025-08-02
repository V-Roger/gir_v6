<script lang="ts">
  let { data } = $props()
</script>

<h1>Virgil ROGER</h1>
<div class="prose max-w-none dark:prose-invert">
  <data.content />
  <h2>Exhibitions</h2>
  <ul>
    {#each data.meta.exhibitions as exhibition}
      <li>{exhibition.place} - {exhibition.date}</li>
    {/each}
  </ul>
  <h2>Publications</h2>
  <ul>
    {#each data.meta.publications as publication}
      <li>{publication.medium} - {publication.date}</li>
    {/each}
  </ul>
</div>
