/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
// import { PUBLIC_VAPID_PUBLIC_KEY } from '..'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING')
        self.skipWaiting()
})

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
    allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
    createHandlerBoundToURL('/'),
    { allowlist },
))

async function getEndpoint() {
    const subscription = await self.registration.pushManager.getSubscription();
    console.log(subscription?.endpoint);
    await subscribeUser();
}


// Register event listener for the ‘push’ event.
self.addEventListener('push', function (event) {
    // Keep the service worker alive until the notification is created.
    event.waitUntil(
        getEndpoint()
            .then(function (endpoint) {
                // Retrieve the textual payload from the server using a GET request. We are using the endpoint as an unique ID
                // of the user for simplicity.
                console.log('endpoint', endpoint);
                return fetch('./getPayload?endpoint=' + endpoint);
            })
            .then(function (response) {
                return response.text();
            })
            .then(function (payload) {
                // Show a notification with title ‘ServiceWorker Cookbook’ and use the payload as the body.
                self.registration.showNotification('ServiceWorker Cookbook', {
                    body: payload,
                });
            })
    );
});
async function subscribeUser() {
    const applicationServerPublicKey = 'BMUJbBU_m6qDWJenQN1vxsDv4g1VKwb1F9897obnLxRxtUFN6LQInFXPxa0oXJFBb2eBq9uSuwo5eei4_1c9iEI';
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    return await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
    });
}
function urlB64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}