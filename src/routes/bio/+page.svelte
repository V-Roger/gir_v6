<script lang="ts">
  let { data } = $props()
</script>

<h1>Virgil ROGER</h1>
<div class="content prose max-w-none dark:prose-invert">
  <data.content />
  <h2>Expositions</h2>
  <ul>
    {#each data.meta.exhibitions as exhibition}
      <li>
        <b>{exhibition.label}</b> /<br />
        <i>{exhibition.date}</i> &mdash; {exhibition.place}
      </li>
    {/each}
  </ul>
  <h2>Publications</h2>
  <ul>
    {#each data.meta.publications as publication}
      <li>
        <b>{publication.medium}</b> /<br />
        <i>{publication.date}</i>
      </li>
    {/each}
  </ul>
</div>
