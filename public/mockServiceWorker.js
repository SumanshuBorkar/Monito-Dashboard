/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (2.0.11).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = "02f4ad4a2797f85668baf5a821ebae707"
const IS_MOCKED_RESPONSE = Symbol("isMockedResponse")
const activeClientIds = new Set()

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener("message", async (event) => {
  const clientId = event.source.id

  if (!clientId || !event.data) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: "window",
  })

  switch (event.data.type) {
    case "KEEPALIVE_REQUEST": {
      sendToClient(event.source, {
        type: "KEEPALIVE_RESPONSE",
      })
      break
    }

    case "INTEGRITY_CHECK_REQUEST": {
      sendToClient(event.source, {
        type: "INTEGRITY_CHECK_RESPONSE",
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }

    case "MOCK_ACTIVATE": {
      activeClientIds.add(clientId)

      sendToClient(event.source, {
        type: "MOCKING_ENABLED",
        payload: true,
      })
      break
    }

    case "MOCK_DEACTIVATE": {
      activeClientIds.delete(clientId)
      break
    }

    case "CLIENT_CLOSED": {
      activeClientIds.delete(clientId)

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      // Unregister itself when there are no more clients
      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const accept = request.headers.get("accept") || ""

  // Bypass server-sent events.
  if (accept.includes("text/event-stream")) {
    return
  }

  // Bypass navigation requests.
  if (request.mode === "navigate") {
    return
  }

  // Opening the DevTools triggers the "only-if-cached" request
  // that cannot be handled by the worker. Bypass such requests.
  if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
    return
  }

  // Bypass all requests when there are no active clients.
  // Prevents the self-unregistered worked from handling requests
  // after it's been deleted (still remains active until the next reload).
  if (activeClientIds.size === 0) {
    return
  }

  // Generate unique request ID.
  const requestId = Math.random().toString(16).slice(2)

  event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      if (error.name === "NetworkError") {
        console.warn(
          'Detected a NetworkError when requesting "%s", which is likely due to the CORS policy of your domain. You should resolve this issue by setting up a CORS policy for the given request either on your server, or by using the "cors" option in `setupWorker` call (only do this if you cannot do the former).',
          request.url,
        )
      }

      throw error
    }),
  )
})

async function handleRequest(event, requestId) {
  const client = await resolveMainClient(event)
  const response = await getResponse(event, client, requestId)

  // Send back the response clone for the "response:*" life-cycle events.
  // Ensure MSW is active and ready to handle the message, otherwise
  // this message will pend indefinitely.
  if (client && activeClientIds.has(client.id)) {
    ;(async () => {
      const responseClone = response.clone()
      sendToClient(client, {
        type: "RESPONSE",
        payload: {
          requestId,
          type: responseClone.type,
          ok: responseClone.ok,
          status: responseClone.status,
          statusText: responseClone.statusText,
          body: responseClone.body === null ? null : await responseClone.text(),
          headers: Object.fromEntries(responseClone.headers.entries()),
          redirected: responseClone.redirected,
        },
      })
    })()
  }

  return response
}

// Resolve the main client for the given event.
// Client that issues a request doesn't necessarily equal the client
// that registered the worker. It's with the latter the worker should
// communicate with during the response resolution.
async function resolveMainClient(event) {
  const url = new URL(event.request.url)

  // If the worker was registered for a specific scope, ensure only
  // clients within that scope are resolved in the future.
  const registration = await self.registration

  if (
    url.pathname === registration.scope.replace(location.origin, "") &&
    (event.request.mode === "navigate" || event.request.mode === "cors")
  ) {
    return self.clients.get(event.clientId)
  }

  // For all other requests, resolve the client that registered the worker.
  // This approach is more applicable to scenarios where all requests
  // should be resolved with the same client.
  const allClients = await self.clients.matchAll({
    type: "window",
  })

  return allClients
    .filter((client) => {
      // Get the client's URL from the referrer in case of the "navigate" request
      // (in such cases, document.URL is not yet available).
      const clientUrl = new URL(client.url || event.request.referrer, location.href)

      // When a worker is registered for the first time, in Chrome, it will
      // download the worker script even if the registration scope does not
      // include the source page (after a reload, the page should be within scope).
      // The worker, however, will not be activated, and is only activated on the
      // subsequent reload of the page.
      //
      // Source: https://stackoverflow.com/a/38980776/15592820
      //
      // Mac Safari also exhibits this behavior, downloading the worker script
      // for pages outside of the registration scope.
      return clientUrl.pathname.startsWith(registration.scope.replace(location.origin, ""))
    })
    .find((client) => {
      return activeClientIds.has(client.id)
    })
}

async function getResponse(event, client, requestId) {
  const { request } = event
  const requestClone = request.clone()

  function passthrough() {
    // Clone the request because it might've been already used
    // (i.e. its body has been read and sent to the client).
    const headers = Object.fromEntries(requestClone.headers.entries())

    // Remove MSW-specific request headers so the bypassed requests
    // comply with the server's CORS preflight check.
    // Operate with the headers as an object because request "Headers"
    // are immutable.
    delete headers["x-msw-bypass"]

    return fetch(requestClone, { headers })
  }

  // Bypass mocking when the client is not active.
  if (!client) {
    return passthrough()
  }

  // Bypass initial page load requests (i.e. static assets).
  // The absence of the immediate/parent client in the map of the active clients
  // means that MSW hasn't dispatched the "MOCK_ACTIVATE" event yet
  // and is not ready to handle requests.
  if (!activeClientIds.has(client.id)) {
    return passthrough()
  }

  // Bypass requests with the explicit bypass header.
  // Such requests can be issued by "ctx.fetch()".
  if (request.headers.get("x-msw-bypass") === "true") {
    return passthrough()
  }

  // Notify the client that a request has been intercepted.
  const requestBuffer = await request.arrayBuffer()
  const clientMessage = await sendToClient(
    client,
    {
      type: "REQUEST",
      payload: {
        id: requestId,
        url: request.url,
        mode: request.mode,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        cache: request.cache,
        credentials: request.credentials,
        destination: request.destination,
        integrity: request.integrity,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        body: requestBuffer,
        bodyUsed: request.bodyUsed,
        keepalive: request.keepalive,
      },
    },
    5000,
  )

  switch (clientMessage.type) {
    case "MOCK_RESPONSE": {
      return respondWithMock(clientMessage.data)
    }

    case "MOCK_NOT_FOUND": {
      return passthrough()
    }

    case "NETWORK_ERROR": {
      const { name, message } = clientMessage.data
      const networkError = new Error(message)
      networkError.name = name

      // Rejecting a "respondWith" promise is equivalent to
      // throwing during the request, which will result in a
      // generic "TypeError: Failed to fetch" thrown instead
      // of a meaningful error message.
      throw networkError
    }
  }

  return passthrough()
}

function sendToClient(client, message, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(event.data.error)
      }

      resolve(event.data)
    }

    client.postMessage(message, [channel.port2])

    setTimeout(() => {
      reject(new Error("timeout"))
    }, timeout)
  })
}

function respondWithMock(response) {
  return new Response(response.body, response)
}
