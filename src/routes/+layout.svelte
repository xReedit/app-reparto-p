<script>
  import { pwaInfo } from 'virtual:pwa-info'; 

	import "../app.css";	
  import '$root/styles/micss.css';
	import { onMount } from 'svelte';

  onMount(async () => {
    if (pwaInfo) {
      // @ts-ignore
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({
        immediate: true,
        // @ts-ignore
        onRegistered(r) {          
          console.log(`SW Registered: ${r}`)
        },
        // @ts-ignore
        onRegisterError(error) {
          console.log('SW registration error', error)
        }
      })
    }
  })

  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

<svelte:head> 
 	{@html webManifestLink} 
</svelte:head>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }

</style>


<div class="content"> 
  <slot/>
</div>


{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt}}
  <ReloadPrompt />
{/await}