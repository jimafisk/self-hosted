<script>
  import axios from 'axios'
  import {TextField,PrimaryButton} from '@primo-app/ui'
  import {fade} from 'svelte/transition'
  import {user} from './Account.svelte'

  async function connectDB() {

    loading = true
    console.log(uri)
    const {data:dbRes} = await axios.post('http://localhost:3005/__fn/setup/db', {uri})
    setTimeout(1000, async () => {

      loading = false

      if (dbRes.success) {

        const {data:authRes} = await axios.post('http://localhost:3005/__fn/auth/create', $user)
        console.log(dbRes)
        if (authRes.success) {
          setTimeout(1000, () => dispatch('click'))
        } 

      } else {
        error = true
      }

    })

  }
  

  let uri = ''
  let loading = false
  let error = false
</script>

<main in:fade>
  <div class="content">
    <p>primo uses MongoDB Atlas to store your website's data. Its free tier is more that sufficient, and once you connect it, you won't have to think about it again.</p>

    <div>
      Follow these instructions to get your database's URI (don't worry about your credentials, they'll be stored in a Heroku environment variable): 
      <ol class="list-decimal list-inside">
        <li>Sign up for a <a href="https://account.mongodb.com/account/register?signedOut=true">MongoDB cloud account</a> (you can skip the account set-up)</li>
        <li>On the Cluster selection page ('Choose a path. Adjust anytime.'), select <strong>Shared Clusters</strong></li>
        <li>Select any provider/region and click 'Create Cluster'</li>
        <ol class="list-decimal list-inside">
          <li>Allow Access from Anywhere</li>
          <li>Save 0.0.0.0 IP Address</li>
          <li>Create a Database User (remember your password, you'll need it in the next step)</li>
        </ol>
        <li><strong>Connect your application</strong></li>
        <li>Ensure the <strong>Node.js</strong> driver is selected</li>
        <li>Copy the connection string</li>
      </ol>
    </div>
  </div>
  <form on:submit|preventDefault={connectDB}>
    {#if error}
      <div class="text-sm text-gray-700 p-4 bg-yellow-300 mb-4">
        Could not connect to database. Ensure your credentials are correct and the uri has the correct form 
      </div>
    {/if}
    <TextField autofocus label="Database URI" size="small" type="url" bind:value={uri} placeholder="mongodb://localhost:27017" variants="mb-4" />
    <div>
      The connection string should look like this: <pre>mongodb+srv://<strong>username</strong>:<strong>password</strong>@<strong>cluster</strong>.<strong>region</strong>.mongodb.net</pre>
      <p>If there's anything after <em>mongodb.net</em>, remove it</p>
    </div>
    <PrimaryButton {loading} type="submit">Connect Database</PrimaryButton>
  </form>
</main>

<style>
  .content {
    @apply text-sm text-gray-700 p-4 bg-gray-100 mb-4;
  }
  .content ol {@apply list-decimal list-inside;}
  .content a {@apply underline text-blue-500;}
</style>