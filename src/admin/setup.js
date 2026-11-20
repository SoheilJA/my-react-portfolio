import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import './admin.css'

export function setupPrimeVue(app) {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
                darkModeSelector: '.admin-mode',
        cssLayer: { name: 'primevue', order: 'theme, base, primevue' },
      },
    },
  })
  app.use(ToastService)
  app.use(ConfirmationService)
}