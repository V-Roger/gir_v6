<script lang="ts">
  let { relative = false } = $props()
</script>

<div
  class="loader"
  class:relative
></div>

<style>
  .loader {
    position: fixed;
    top: 50%;
    left: 0;
    width: 100vw;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(0.8);
    padding: 6px;
    pointer-events: none;
    background: var(--color-white);
    --c: #0000 64%, #000 66% 98%, #0000 101%;
    filter: blur(4px) contrast(12);
  }

  .loader.relative {
    position: relative;
  }

  @media (prefers-color-scheme: dark) {
    .loader {
      --c: #fff0 64%, #fff 66% 98%, #fff0 101%;
      background: var(--color-black);
      mix-blend-mode: difference;
    }
  }

  .loader:before {
    content: '';
    height: 30px;
    aspect-ratio: 3;
    background:
      radial-gradient(35% 146% at 50% 159%, var(--c)) 0 0,
      radial-gradient(35% 146% at 50% -59%, var(--c)) 100% 100%;
    background-size: calc(200% / 3) 50%;
    background-repeat: repeat-x;
    animation: l11 0.6s infinite linear;
  }

  @keyframes l11 {
    to {
      background-position:
        -200% 0,
        -100% 100%;
    }
  }
</style>
