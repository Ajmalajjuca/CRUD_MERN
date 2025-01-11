import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './redux/store'
import { Toaster } from './components/ui/toaster.jsx'

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <Toaster/>
      <App />
    </PersistGate>
  </Provider>

)
