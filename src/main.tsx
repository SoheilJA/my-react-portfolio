import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import '@fontsource-variable/ibm-plex-sans';
import '@fontsource-variable/ibm-plex-sans/wght-italic.css';
import '@fontsource-variable/mona-sans';
import '@fontsource-variable/mona-sans/wght-italic.css';
import '@fontsource-variable/vazirmatn';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/russo-one/400.css';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
