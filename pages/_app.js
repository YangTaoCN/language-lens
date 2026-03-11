import '../styles/globals.css';
import { TranslationProvider } from '../hooks/use-translation';

export default function App({ Component, pageProps }) {
  return (
    <TranslationProvider>
      <Component {...pageProps} />
    </TranslationProvider>
  );
}
