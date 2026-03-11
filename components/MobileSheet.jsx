import { X, Volume2, Globe, Star } from 'lucide-react';
import { useTranslation } from '../hooks/use-translation';

export default function MobileSheet({
  selectedText,
  translation,
  isOpen,
  onClose,
  playPronunciation,
  saveWord,
}) {
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 bg-white shadow-lg rounded-t-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{selectedText}</h3>
        <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
          <X size={24} />
        </button>
      </div>
      <p className="mt-2 text-gray-600">{translation}</p>
      <div className="flex items-center mt-4 space-x-4">
        <button onClick={playPronunciation} className="flex items-center space-x-2 text-blue-500">
          <Volume2 size={20} />
          <span>{t('pronounce')}</span>
        </button>
        <a
          href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(selectedText)}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-2 text-blue-500"
        >
          <Globe size={20} />
          <span>{t('images')}</span>
        </a>
        <button onClick={saveWord} className="flex items-center space-x-2 text-blue-500">
          <Star size={20} />
          <span>{t('save')}</span>
        </button>
      </div>
    </div>
  );
}
