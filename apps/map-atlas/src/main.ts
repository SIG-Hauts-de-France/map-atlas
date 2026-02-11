import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { environment } from './environments/environment'
import {
  loadAppConfigHDF,
  getGlobalConfig,
} from '@geonetwork-ui/util/app-config'
import { enableFallbackWithoutWorker } from '@camptocamp/ogc-client'

if (environment.production) {
  enableProdMode()
}

loadAppConfigHDF().then(() => {
  if (getGlobalConfig().PROXY_PATH) {
    // disable worker in ogc-client to allow using a proxy with a Referer check
    enableFallbackWithoutWorker()
  }

  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err))

  const matomoScript = document.createElement('script')
  matomoScript.type = 'text/javascript'
  matomoScript.text = `
    var _paq = window._paq = window._paq || [];
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
      var u="${getGlobalConfig().MATOMO_URL}";
      _paq.push(['setTrackerUrl', u+'matomo.php']);
      _paq.push(['setSiteId', '${getGlobalConfig().MATOMO_SITE_ID}']);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
    })();
  `
  document.head.appendChild(matomoScript)
})
