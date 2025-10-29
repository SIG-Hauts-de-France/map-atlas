import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { loadAppConfig, loadAppConfigHDF } from '@geonetwork-ui/util/app-config'
import { AppModule } from './app/app.module'

loadAppConfigHDF().then(() => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err))
})
