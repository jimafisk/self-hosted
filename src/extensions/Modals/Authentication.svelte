<script>
  import axios from 'axios'
  import {modal} from '@primo-app/primo'
  import {TextField,PrimaryButton} from '@primo-app/ui'
  import {user} from '../../stores'

  async function submitForm(e) {
    loading = true
    const {data} = await axios.post('http://localhost:3005/login', { email, password })
    loading = false
    if (data.success) {
      $user = { ...$user, signedIn: true }
      modal.hide()
    } else {
      error = data.message
    }
  }

  let email = ''
  let password = ''
  let loading = false
  let error 

</script>

<div class="logo pt-6 pb-3">
  <img src="/logo.svg" alt="primo logo" class="mx-auto"/>
</div>

<div class="w-full">
  <form class="bg-white px-4 pb-4" on:submit|preventDefault={submitForm}>
    <TextField autofocus label="Email Address" bind:value={email} placeholder="firstlast@gmail.com" variants="my-4" />
    <TextField label="Password" type="password" bind:value={password} placeholder="hunter2" variants="mb-4" />
    <PrimaryButton type="submit" {loading}>Sign In</PrimaryButton>
  </form>
</div>


<style>
  .logo {
    @apply text-center;
  }

  a {
    @apply p-4 opacity-100 transition-opacity duration-500 flex justify-center;
  }

  a:hover {
    @apply opacity-75 transition-opacity duration-500;
  }

  img {
    @apply max-w-md py-0 px-8;
  }

  i.fa-spinner {
    animation-name: spin;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    will-change: transform;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>