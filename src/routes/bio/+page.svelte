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
