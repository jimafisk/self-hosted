<script>
  import { fade } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import axios from 'axios/dist/axios'
  import {site,modal} from '@primo-app/primo'

  let dispatch = createEventDispatcher();

  async function buildSite() {
    axios.post('http://localhost:3005/__fn/build', $site)
    modal.hide()
  }

</script>

<button on:click={buildSite} class="svelte-tb0xfd bg-gray-900 transition-100 text-gray-200 hover:bg-gray-800 py-1">Build site</button>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  button[disabled] {
    @apply text-white bg-blue-300 cursor-not-allowed transition-colors duration-200 !important;
  }
</style>