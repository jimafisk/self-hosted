<script>
  import axios from 'axios'
  import { createEventDispatcher, onMount } from 'svelte'
  const dispatch = createEventDispatcher()

  import {saveFileToRepo} from '../../utilities'
  import {user,repo} from '../../stores'
  import {Spinner} from '../../@components/misc'

  export let field

  if (typeof field.value === 'string') {
    field.value = {
      alt: '',
      url: field.value,
      size: null,
    }
  }

  function encodeImageFileAsURL(e) {
    var filesSelected = imageUploader.files;
    if (filesSelected.length > 0) {
      uploading = true
      const file = filesSelected[0]
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = async function(fileLoadedEvent) {
        const dataUrl = fileLoadedEvent.target.result
        imagePreview = dataUrl
        
        const b64 = dataUrl.replace(/data:image\/(png|jpg|jpeg);base64,/,'')

        const data = await saveFileToRepo({
          repo: $repo,
          name: 'assets/'+file.name,
          content: b64,
          token: $user.githubToken,
          message: 'upload image'
        })

        // const res = await axios.put(`https://api.github.com/repos/${$repo}/contents/assets/${file.name}?access_token=${$user.githubToken}`, {
        //   message: `upload image`,
        //   content: b64
        // }).catch(e => console.error(e))
        if (data) {
          const {download_url:url, sha, size} = data.content
          field.value = {
            ...field.value,
            url,
            size: Math.round(size / 1000)
          }
          dispatch('input')
        } else {
          alert('Could not upload image. Ensure it is a png or jpg and another image with the same name does not already exist in the repository.')
        }

        uploading = false

      }
    }
  }

  let imagePreview = field.value.url
  let uploading = false
  let imageUploader
  
</script>

<div class="flex flex-col">
  <span class="text-xl">{field.label}</span>
  <div class="flex h-24">
    <div class="image-preview" class:uploading role="img" style="background-image:url('{imagePreview}')" >
      {#if uploading}
        <Spinner />
      {/if}
      {#if field.value.size}
        <span class="bg-gray-100 text-gray-500 absolute top-0 right-0 p-1 text-xs font-semibold" style="border-bottom-left-radius: 0.25rem;">
          {field.value.size}KB
        </span>
      {/if}
    </div>
    <div class="flex flex-col w-full">
      <div class="image-upload hover:bg-gray-200">
        <label for="image-{field.id}" class="cursor-pointer flex flex-col text-gray-800 font-semibold text-center items-center justify-center absolute top-0 bottom-0 left-0 right-0">
          <i class="fas fa-file-upload"></i>
          <span>Select an image</span>
        </label>
        <input 
          on:change={encodeImageFileAsURL}
          class="invisible" 
          id="image-{field.id}" 
          bind:this={imageUploader}
          type="file" 
          accept="image/*" />
      </div>
      <label class="p-2 flex text-sm bg-gray-100 border-t border-gray-200">
        <span class="px-2">URL</span>
        <input 
          on:input={(e) => {
            const {value} = e.target
            imagePreview = value
            field.value = {
              ...field.value,
              url: value,
              size: null
            }
            dispatch('input')
          }}
          value={field.value.url}
          type="url" 
          class="flex-1 border-b-2 border-gray-200 bg-gray-100 pl-2 outline-none"
        />
      </label>
    </div>
  </div>
  <div class="pt-3">
    <label class="w-full flex text-sm">
      <span class="font-semibold mr-2">Alt text</span> 
      <input type="text" class="flex-1 border-b-2 border-gray-200 outline-none" bind:value={field.value.alt}>
    </label>
  </div>
  <!-- <label class="flex items-center flex-1">
    <span class="font-semibold text-sm mr-2">Image URL</span>
    <input bind:value={field.value} on:input={() => dispatch('input', field.value)} class="bg-gray-100 p-2 flex-1" type="url" placeholder="https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg">
  </label> -->
</div>
<slot></slot>

<style>
  .image-preview {
    @apply relative w-48 mr-2 flex justify-center items-center border-2 border-gray-100 transition-colors duration-200 bg-cover bg-center bg-no-repeat;

    &.uploading {
      @apply border-primored;
    }
  }
  .image-upload {
    @apply flex-1 p-4 cursor-pointer relative w-full flex items-center justify-center bg-gray-100 transition-colors duration-100;
  }
</style>