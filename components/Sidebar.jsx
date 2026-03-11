import { X, Trash2 } from 'lucide-react';
import { useTranslation } from '../hooks/use-translation';

export default function Sidebar({
  isOpen,
  onClose,
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
  handleFile,
  autoPlay,
  setAutoPlay,
  showHotspotBorder,
  setShowHotspotBorder,
  vocab,
  removeVocab,
  selectedText,
  translation,
  playPronunciation,
  saveWord,
}) {
  const { t } = useTranslation();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-lg transform transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 md:w-80`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{t('settings')}</h2>
        <button onClick={onClose} className="p-2 rounded-md md:hidden hover:bg-gray-100">
          <X size={24} />
        </button>
      </div>
      <div className="p-4 space-y-6">
        {/* Settings sections */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('learningLanguage')}</label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md"
          >
            <option value="ja">{t('japanese')}</option>
            <option value="en">{t('english')}</option>
            <option value="es">{t('spanish')}</option>
            <option value="fr">{t('french')}</option>
            <option value="zh">{t('chinese')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('targetLanguage')}</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md"
          >
            <option value="zh">{t('chinese')}</option>
            <option value="en">{t('english')}</option>
            <option value="ja">{t('japanese')}</option>
            <option value="es">{t('spanish')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('uploadImage')}</label>
          <input type="file" accept="image/*" onChange={handleFile} className="w-full mt-1 text-sm" />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoPlay"
            checked={autoPlay}
            onChange={(e) => setAutoPlay(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="autoPlay" className="text-sm cursor-pointer">
            {t('autoPlayPronunciation')}
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showHotspot"
            checked={showHotspotBorder}
            onChange={(e) => setShowHotspotBorder(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="showHotspot" className="text-sm cursor-pointer">
            {t('showHotspotBorders')}
          </label>
        </div>
      </div>
      <div className="p-4 border-t">
        <h3 className="text-lg font-semibold">{t('vocabulary')}</h3>
        <ul className="mt-2 space-y-2 overflow-y-auto max-h-48">
          {vocab.length === 0 && <li className="text-sm text-gray-500">{t('noSavedWords')}</li>}
          {vocab.map((v, i) => (
            <li key={i} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <div>
                <p className="font-medium">{v.text}</p>
                <p className="text-sm text-gray-600">{v.translation}</p>
              </div>
              <button onClick={() => removeVocab(i)} className="p-2 text-red-500 rounded-md hover:bg-red-100">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
