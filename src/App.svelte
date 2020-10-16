<script lang="ts">
	import {setContext} from 'svelte'
	import axios from 'axios'
	import Primo, { createSite, modal, registerProcessors } from '@primo-app/primo'
	import Publish from './extensions/Modals/Build.svelte'
	import Authentication from './extensions/Modals/Authentication.svelte'
	import Setup from './extensions/Modals/Setup/Setup.svelte'
	import {handlebars,postCSS} from './extensions/processors'
	import {user} from './stores'

	registerProcessors({
		html: async (raw, fields) => await handlebars(raw, fields),
		css: async (raw, options) => await postCSS(raw, options)
	})

	// Register Modals
	modal.register([
		{
			id: 'BUILD',
			component: Publish,
			options: {
				route: 'build',
				width: 'md',
				header: {
					title: 'Build to Github',
					icon: 'fab fa-github'
				},
			},
		},
		{
			id: 'AUTH',
			component: Authentication,
			options: {
				route: 'auth',
				width: 'md',
				disableClose: true
			}
		},
		{
			id: 'SETUP',
			component: Setup,
			options: {
				route: 'setup',
				width: 'md',
				disableClose: true
			}
		},
	])

	async function saveData(data) {
		saving = true
		// $user.signedIn &&	await axios.post('http://localhost:3005/__fn/data', data)
		await axios.post('http://localhost:3005/__fn/data', data)
		saving = false
	}

	async function getData() {
		const {data} = await axios.get('http://localhost:3005/__fn/data')
		return data
	}

	getData().then((res) => {
		console.log({res})
		if (res) data = res 
		else modal.show('SETUP')
	})

	let data = createSite()
	let saving = false

	modal.show('SETUP')
	// modal.show('AUTH')

</script>

<Primo 
	{data}
	{saving}
	on:save={({detail:data}) => {
		saveData(data)
	}} 
	on:change={({detail:content}) => {
		console.log(content)
	}} 
/>