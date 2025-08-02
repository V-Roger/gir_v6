<script lang="ts">
  let { relative = false } = $props()
</script>

<div
  class="filmstrip"
  class:relative
></div>

<style>
  .filmstrip {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1000;
    width: 60px;
    height: 100px;
    background: var(--color-dark);
    background-image: repeating-linear-gradient(
      0,
      var(--color-black),
      var(--color-black) 90px,
      var(--color-white) 90px,
      var(--color-white) 98px
    );

    background-size: 60px 200px;
    transform: rotate(90deg) translate(-50%, -50%);
    border-radius: 4px;
    animation: stripeMove 1200ms infinite;

    &.relative {
      position: relative;
    }

    &:before,
    &:after {
      content: '';
      height: 200px;
      position: absolute;
      border-left: 6px dotted var(--color-white);
      animation: roll 1200ms infinite;
    }

    &:before {
      left: 6px;
    }

    &:after {
      right: 6px;
    }

    @media (prefers-color-scheme: dark) {
      background: var(--color-white);
      background-image: repeating-linear-gradient(
        0,
        var(--color-white),
        var(--color-white) 90px,
        var(--color-black) 90px,
        var(--color-black) 98px
      );

      &:before,
      &:after {
        border-left: 6px dotted var(--color-black);
      }
    }
  }

  @keyframes roll {
    0% {
      top: -10px;
    }
    100% {
      top: -110px;
    }
  }

  @keyframes stripeMove {
    0% {
      background-position: center -10px;
    }
    100% {
      background-position: center -110px;
    }
  }
</style>
