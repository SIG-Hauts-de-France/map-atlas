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

  const matomoUrl = getGlobalConfig().MATOMO_URL
  const matomoSiteId = getGlobalConfig().MATOMO_SITE_ID
  if (matomoUrl && matomoSiteId) {
    const matomoScript = document.createElement('script')
    matomoScript.type = 'text/javascript'
    matomoScript.text = `
      var _paq = window._paq = window._paq || [];
      var u="${matomoUrl}";
      _paq.push(['setTrackerUrl', u+'matomo.php']);
      _paq.push(['setSiteId', '${matomoSiteId}']);
      _paq.push(['alwaysUseSendBeacon', true]);
      _paq.push(['trackPageView']);
      // Complète enableLinkTracking (URLs avec paramètres, formats géo, etc.)
      (function() {
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
      })();
      var DOWNLOAD_EXT = /\\.(pdf|doc|docx|xls|xlsx|csv|zip|png|jpe?g|geojson|json|shp|gml|kml|kmz|gpkg|fgb|dxf|svg|html?|tar\\.gz)$/i;
      function isDownloadHref(href) {
        if (!href || href.indexOf('javascript:') === 0 || href.charAt(0) === '#') return false;
        try {
          return DOWNLOAD_EXT.test(new URL(href, window.location.href).pathname);
        } catch (e) {
          return DOWNLOAD_EXT.test(href.split(/[?#]/)[0]);
        }
      }
      document.addEventListener('click', function(e) {
        var link = e.target.closest('a[href]');
        if (!link || !isDownloadHref(link.href)) return;
        _paq.push(['trackLink', link.href, 'download']);
      }, true);
    `
    document.head.appendChild(matomoScript)
  }
})
