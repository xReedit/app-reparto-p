<script>
  import { pwaInfo } from 'virtual:pwa-info'; 

	import "../app.css";	
  import '$root/styles/micss.css';
	import { onMount } from 'svelte';
	import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
	import { NotificationPushService } from '$root/services/NotificationPush.services';

  onMount(async () => {

    const notificationPushService = new NotificationPushService();

    if (pwaInfo) {
      // @ts-ignore
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({
        immediate: true,
        // @ts-ignore
        async onRegistered(r) {          
          console.log(`SW Registered: ${r}`)
          let sub = await r.pushManager.getSubscription();
                if (!sub) {                    
                    sub = await r.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: notificationPushService.urlB64ToUint8Array(PUBLIC_VAPID_PUBLIC_KEY),
                    });
                }
                console.log(sub);

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