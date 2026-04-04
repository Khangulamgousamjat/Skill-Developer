import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './Router.jsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store.js';

import { SocketProvider } from './context/SocketContext.jsx';

import { LanguageProvider } from './contexts/LanguageContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);

