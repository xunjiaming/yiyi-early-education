import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

import { registerSW } from 'virtual:pwa-register'
import { trackInstallPrompt } from './lib/install'

trackInstallPrompt()
const hadController = Boolean(navigator.serviceWorker?.controller)
let refreshing = false
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (refreshing || !hadController) return
  refreshing = true
  window.location.reload()
})

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
