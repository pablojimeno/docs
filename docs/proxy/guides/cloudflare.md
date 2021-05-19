---
title: Proxying Plausible through Cloudflare
---

You can use Cloudflare Workers to proxy your Plausible Analytics requests. Cloudflare Workers offers free service for up to 100,000 requests per day.
All you need to set it up is a free Cloudflare account.

Step 0: Sign up if you already haven't

## Step 1: Create a worker

In you Cloudflare account, click the dropdown on the top left and choose 'Workers'. On the workers page, click on 'Create a Worker' to
start configuring your proxy. Next, you'll see a page where you can edit the code for your edge worker. Paste the following code:

```js
const ScriptName = '/js/script.js';
const Endpoint = '/api/event';

const ScriptWithoutExtension = ScriptName.replace('.js', '')

addEventListener('fetch', event => {
    event.passThroughOnException();
    event.respondWith(handleRequest(event));
})

async function handleRequest(event) {
  const pathname = new URL(event.request.url).pathname
  const [baseUri, ...extensions] = pathname.split('.')

  if (baseUri === ScriptWithoutExtension) {
      return getScript(event, extensions)
  } else if (pathname === Endpoint) {
      return postData(event)
  }
}

async function getScript(event, extensions) {
    let response = await caches.default.match(event.request);
    if (!response) {
        response = await fetch("https://plausible.io/js/plausible." + extensions.join("."));
        event.waitUntil(caches.default.put(event.request, response.clone()));
    }
    return response;
}

async function postData(event) {
    return await fetch("https://plausible.io/api/event", event.request);
}
```

## Step 2: Make sure the script is accessible

Once you've added the code for the worker, you can save and deploy the worker. At this point, you can click 'Rename' in the Workers' dashboard to
give your worker a meaningful name (avoid words like 'analytics', 'tracking', etc.). Now, the Plausible script should be accessible at the following
url:

```
<your-worker-name>.<your-cloudflare-username>.workers.dev/js/script.js
```

If you can load this URL and see some Javascript code, you should be good to go to the following step.

## Step 3: Install your proxy script

Once you have the URL for your script, you can replace your Plausible Analytics script tag with the proxied one instead:

```html
<script async data-domain="yourdomain.com" src="<project>.<username>.workers.dev/js/script.js"></script>
```