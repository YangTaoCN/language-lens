import { useTranslation } from '../hooks/use-translation';
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import MobileSheet from '../components/MobileSheet';

export default function Home() {
  const { t } = useTranslation();
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('zh');
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [vocab, setVocab] = useState([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState(null);
  const [translateLoading, setTranslateLoading] = useState(false);
  const [translateError, setTranslateError] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showHotspotBorder, setShowHotspotBorder] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const s = localStorage.getItem('ll_source');
    const t = localStorage.getItem('ll_target');
    const ap = localStorage.getItem('ll_autoplay');
    const shb = localStorage.getItem('ll_showhotspotborder');
    if (s) setSourceLang(s);
    if (t) setTargetLang(t);
    if (ap !== null) setAutoPlay(ap === 'true');
    if (shb !== null) setShowHotspotBorder(shb === 'true');

    fetch('/api/vocab')
      .then((r) => r.json())
      .then((j) => {
        if (j && Array.isArray(j.vocab)) setVocab(j.vocab);
      })
      .catch(() => {
        const v = localStorage.getItem('ll_vocab');
        if (v) setVocab(JSON.parse(v));
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('ll_source', sourceLang);
    localStorage.setItem('ll_target', targetLang);
  }, [sourceLang, targetLang]);

  useEffect(() => {
    try {
      localStorage.setItem('ll_vocab', JSON.stringify(vocab));
    } catch (e) {}
  }, [vocab]);

  useEffect(() => {
    localStorage.setItem('ll_autoplay', autoPlay);
  }, [autoPlay]);

  useEffect(() => {
    localStorage.setItem('ll_showhotspotborder', showHotspotBorder);
  }, [showHotspotBorder]);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImageSrc(url);
    setSelectedText(null);
    setTranslation(null);
  }

  async function handleSelect(text) {
    setSelectedText(text);
    setTranslateError(null);
    setTranslation(t('loading'));
    setTranslateLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source: sourceLang, target: targetLang }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP ${res.status}`);
      }
      const j = await res.json();
      setTranslation(j.translation || t('noTranslation'));
      if (autoPlay) {
        playPronunciation(text);
      }
    } catch (e) {
      setTranslation(null);
      setTranslateError(e.message || t('translationFailed'));
    } finally {
      setTranslateLoading(false);
    }
  }

  function playPronunciation(textToSpeak = selectedText) {
    if (!textToSpeak || !window.speechSynthesis) {
      return;
    }

    const map = { ja: 'ja-JP', en: 'en-US', es: 'es-ES', fr: 'fr-FR', zh: 'zh-CN' };
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = map[sourceLang] || sourceLang;

    const speak = () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    // The voices may not be loaded initially, especially on mobile.
    // We need to wait for the voices to be loaded before speaking.
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
        // It's good practice to remove the event listener after it has been used.
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      speak();
    }
  }

  function saveWord() {
    if (!selectedText) return;
    const item = {
      text: selectedText,
      translation,
      source: sourceLang,
      target: targetLang,
      addedAt: Date.now(),
    };
    fetch('/api/vocab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
      .then((r) => r.json())
      .then((j) => {
        if (j && j.vocab) setVocab(j.vocab);
      })
      .catch(() => {
        setVocab((prev) => [item, ...prev.filter((i) => i.text !== selectedText)]);
      });
  }

  function removeVocab(idx) {
    const item = vocab[idx];
    if (!item) return;
    fetch('/api/vocab', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: item.text }),
    })
      .then((r) => r.json())
      .then((j) => {
        if (j && j.vocab) setVocab(j.vocab);
      })
      .catch(() => {
        setVocab((prev) => prev.filter((_, i) => i !== idx));
      });
  }

  async function startCamera() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => console.error('video play error:', err));
        };
        setCameraOn(true);
      }
    } catch (e) {
      let errMsg = t('cameraError');
      if (e.name === 'NotAllowedError')
        errMsg = t('cameraPermissionDenied');
      else if (e.name === 'NotFoundError')
        errMsg = t('cameraNotFound');
      else if (e.name === 'NotReadableError')
        errMsg = t('cameraInUse');
      setCameraError(errMsg);
    }
  }

  function stopCamera() {
    const s = videoRef.current?.srcObject;
    if (s) {
      const tracks = s.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setCameraError(null);
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImageSrc(dataUrl);
    stopCamera();
  }

  return (
    <div className="flex flex-col h-screen">
      <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sourceLang={sourceLang}
          setSourceLang={setSourceLang}
          targetLang={targetLang}
          setTargetLang={setTargetLang}
          handleFile={handleFile}
          autoPlay={autoPlay}
          setAutoPlay={setAutoPlay}
          showHotspotBorder={showHotspotBorder}
          setShowHotspotBorder={setShowHotspotBorder}
          vocab={vocab}
          removeVocab={removeVocab}
          selectedText={selectedText}
          translation={translation}
          playPronunciation={playPronunciation}
          saveWord={saveWord}
        />
        <MainContent
          imageSrc={imageSrc}
          cameraOn={cameraOn}
          startCamera={startCamera}
          capturePhoto={capturePhoto}
          stopCamera={stopCamera}
          sourceLang={sourceLang}
          targetLang={targetLang}
          handleSelect={handleSelect}
          setOcrLoading={setOcrLoading}
          setOcrError={setOcrError}
          showHotspotBorder={showHotspotBorder}
          handleFile={handleFile}
          videoRef={videoRef}
          canvasRef={canvasRef}
        />
      </div>
      <MobileSheet
        selectedText={selectedText}
        translation={translation}
        isOpen={!!selectedText}
        onClose={() => setSelectedText(null)}
        playPronunciation={() => playPronunciation()}
        saveWord={saveWord}
      />
    </div>
  );
}
