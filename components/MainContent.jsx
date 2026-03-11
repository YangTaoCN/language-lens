import ImageAnnotator from './ImageAnnotator';
import { Camera, X, Upload, Check } from 'lucide-react';
import CameraModal from './CameraModal';
import { useTranslation } from '../hooks/use-translation';

export default function MainContent({
  imageSrc,
  cameraOn,
  startCamera,
  capturePhoto,
  stopCamera,
  sourceLang,
  targetLang,
  handleSelect,
  setOcrLoading,
  setOcrError,
  showHotspotBorder,
  handleFile,
  videoRef,
  canvasRef,
}) {
  const { t } = useTranslation();

  return (
    <main className="relative flex-1 p-4 overflow-auto bg-gray-50">
      {!imageSrc && !cameraOn && (
        <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-500">
          <div className="p-6 text-center border-2 border-dashed rounded-lg">
            <Upload size={48} className="mx-auto" />
            <p className="mt-4 text-lg">{t('uploadInstruction')}</p>
            <input type="file" accept="image/*" onChange={handleFile} className="sr-only" id="file-upload" />
            <label htmlFor="file-upload" className="mt-2 text-sm text-blue-500 cursor-pointer hover:underline">
              {t('chooseFile')}
            </label>
          </div>
          <p>{t('or')}</p>
          <button onClick={startCamera} className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-500 rounded-md">
            <Camera size={20} />
            <span>{t('useCamera')}</span>
          </button>
        </div>
      )}
      {imageSrc && (
        <ImageAnnotator
          imageSrc={imageSrc}
          sourceLang={sourceLang}
          targetLang={targetLang}
          onSelect={handleSelect}
          onOcrState={({ loading, error }) => {
            setOcrLoading(loading);
            setOcrError(error);
          }}
          showHotspotBorder={showHotspotBorder}
        />
      )}
      <CameraModal
        isOpen={cameraOn}
        onClose={stopCamera}
        onCapture={capturePhoto}
        videoRef={videoRef}
        canvasRef={canvasRef}
      >
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-4">
            <button onClick={capturePhoto} className="p-4 text-white bg-blue-500 rounded-full">
                <Check size={24} />
            </button>
            <button onClick={stopCamera} className="p-4 text-white bg-red-500 rounded-full">
                <X size={24} />
            </button>
        </div>
      </CameraModal>
    </main>
  );
}
