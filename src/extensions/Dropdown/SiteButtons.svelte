<!-- <svelte:window on:resize={resizePreview} /> -->

<script>
  import {sites} from '../../stores'
  import {wrapInStyleTags,buildPagePreview} from '../../utils'

  export let onClick

  function resizePreview() {
    const {clientWidth:parentWidth} = container
    const {clientWidth:childWidth} = iframe

    scale = parentWidth / childWidth
  }

  let container
  let scale
  let iframe
  let iframeLoaded = false

  function buildPreview(site) {
    let homePage = site.pages.filter(p => p.id === 'index')[0]
    let preview = '<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" type="text/css">' + wrapInStyleTags(site.styles ? site.styles.final : '') + wrapInStyleTags(homePage.styles ? homePage.styles.final : '') + buildPagePreview(homePage.content)
    return preview
  }

</script>

<ul>
  {#each $sites as siteItem}
    <li class="site-item">
      <button on:click={() => onClick(siteItem)}>
        {siteItem.name}
        <!-- <div bind:this={container}>
          <iframe bind:this={iframe} style="transform: scale({scale})" class:fadein={iframeLoaded} title="page preview" srcdoc={buildPreview(siteItem)} on:load={() => {resizePreview(); iframeLoaded = true }}></iframe>
        </div> -->
      </button>
    </li>
  {/each}
</ul>

<style>
  ul {
    @apply grid grid-cols-2 gap-2 mb-4 list-none;
  }
  button {
    @apply cursor-pointer absolute bottom-0 top-0 left-0 right-0 z-10 bg-transparent opacity-100 transition-all duration-200 w-full h-full bg-primored font-semibold text-white text-xs p-2 rounded;
    overflow-wrap: break-word;
    &:hover {
      @apply bg-red-600;
    }
  }
  .site-item {
    @apply shadow-lg relative overflow-hidden;
    height: 10vh;
    &.active {
      outline: 5px solid rgb(30,30,30);
    }
  }
  .active {
    @apply cursor-default pointer-events-none;
  }
  iframe {
    @apply pointer-events-none opacity-0 transition-opacity duration-200 bg-white;
    width: 100vw;
    transform-origin: top left;
    height: 1000vh;
  }
  .fadein {
    @apply opacity-100;
  }
</style>