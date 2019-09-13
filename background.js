import { getUrl, replaceQuery } from './lib/tool.js'

chrome.webRequest.onBeforeRequest.addListener (
  ({ url }) => {
    const views = chrome.extension.getViews({ type: 'popup' })

    if (views.length > 0) {
      const app = views[0].document.querySelector('app-main')

      if (app) {
        app.urls = [...app.urls, url]
      }
    }

    const redirectUrl = getUrl()[replaceQuery(url)]

    if (redirectUrl) {
      return {
        redirectUrl
      }
    }
  },
  {
    urls: ['http://*/*', 'https://*/*']
  },
  ['blocking'] 
);
