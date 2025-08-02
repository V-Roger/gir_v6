<script lang="ts">
  import { onMount } from 'svelte'

  let { once = false, top = 0, bottom = 0, left = 0, right = 0, intersecting = false, children, intersect } = $props()

  let container: HTMLDivElement

  onMount(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      const rootMargin = `${bottom}px ${left}px ${top}px ${right}px`

      const observer = new IntersectionObserver(
        (entries) => {
          if (!container) {
            return
          }

          intersecting = entries[0].isIntersecting
          if (intersecting && intersect) {
            intersect({ intersecting })
          }
          if (intersecting && once) {
            observer.unobserve(container)
          }
        },
        { rootMargin },
      )

      observer.observe(container)
      return () => observer.unobserve(container)
    }

    // The following is a fallback for older browsers
    function handler() {
      const bcr = container.getBoundingClientRect()

      intersecting =
        bcr.bottom + bottom > 0
        && bcr.right + right > 0
        && bcr.top - top < window.innerHeight
        && bcr.left - left < window.innerWidth

      if (intersecting && intersect) {
        intersect({ intersecting })
      }

      if (intersecting && once) {
        window.removeEventListener('scroll', handler)
      }
    }

    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  })
</script>

<div bind:this={container}>
  {@render children?.({ intersecting })}
</div>
