import React, {useEffect, useRef, useState} from 'react'
import Tesseract from 'tesseract.js'
import { useTranslation } from '../hooks/use-translation';

import Spinner from './Spinner'

export default function ImageAnnotator({imageSrc, sourceLang, targetLang, onSelect, ocr, onOcrState, showHotspotBorder}){
  const imgRef = useRef(null)
  const [boxes, setBoxes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hoveredText, setHoveredText] = useState(null)
  const [hoveredTranslation, setHoveredTranslation] = useState(null)
  const [hoveredPhonetics, setHoveredPhonetics] = useState(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const { t } = useTranslation();

  useEffect(()=>{
    if(!imageSrc) return
    setLoading(true)
    setError(null)
    onOcrState?.({loading: true, error: null})
    const langMap = { en: 'eng', ja: 'jpn', es: 'spa', fr: 'fra', zh: 'chi_sim' }
    const tessLang = langMap[sourceLang] || 'eng'
    const engine = ocr || Tesseract
    const recognizeFn = (engine && (engine.recognize || (engine.default && engine.default.recognize)))
      || (()=>Promise.resolve({data:{words:[]}}))
    recognizeFn(imageSrc, tessLang, { logger: m=>{} })
      .then(({data})=>{
        const words = data.words || []
        setBoxes(words.map(w=>({
          text: w.text,
          bbox: w.bbox
        })))
      })
      .catch((err)=>{
        setBoxes([])
        setError(err?.message || t('translationFailed'))
        onOcrState?.({loading:false, error: err?.message || t('translationFailed')})
      })
      .finally(()=>{
        setLoading(false)
        onOcrState?.({loading:false, error: error})
      })
  },[imageSrc, sourceLang])

  async function handleHotspotHover(text){
    if(hoveredText === text) return
    setHoveredText(text)
    setHoveredTranslation(t('loading'))
    setHoveredPhonetics(t('loading'))
    console.log(`[Hover] hovering on: ${text}, sourceLang: ${sourceLang}`);
    
    try{
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({text, source: sourceLang, target: targetLang || 'zh'})
      })
      if(res.ok){
        const j = await res.json()
        setHoveredTranslation(j.translation || '')
      }
    }catch(e){
      setHoveredTranslation(t('translationFailed'))
    }

    // Fetch phonetics
    try{
      console.log(`[Phonetics] Requesting phonetics for: ${text}`);
      const res = await fetch('/api/phonetics', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({text, lang: sourceLang})
      })
      console.log(`[Phonetics] Response status: ${res.status}`);
      if(res.ok){
        const j = await res.json()
        console.log(`[Phonetics] Got response:`, j);
        setHoveredPhonetics(j.phonetics || '')
      }
    }catch(e){
      console.error(`[Phonetics] Error:`, e);
      setHoveredPhonetics('')
    }
  }

  function handleHotspotLeave(e) {
    setHoveredText(null);
    setHoveredTranslation(null);
    setHoveredPhonetics(null);
  }

  function handleClick(box){
    onSelect && onSelect(box.text)
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {imageSrc && (
        <div className="relative w-full h-full overflow-hidden">
          <img onLoad={() => setImgLoaded(true)} ref={imgRef} src={imageSrc} alt="upload" className="w-full h-full object-contain" />
          {boxes.map((b, i)=>{
            const img = imgRef.current
            if(!img) return null
            
            // Get container dimensions
            const container = img.parentElement
            const containerW = container.clientWidth
            const containerH = container.clientHeight
            
            // Get image's actual rendered dimensions (object-contain preserves aspect ratio)
            const naturalW = img.naturalWidth
            const naturalH = img.naturalHeight
            const imageAspect = naturalW / naturalH
            const containerAspect = containerW / containerH
            
            // Calculate actual display dimensions
            let displayW, displayH, offsetX, offsetY
            if(imageAspect > containerAspect){
              // Image wider than container
              displayW = containerW
              displayH = containerW / imageAspect
              offsetX = 0
              offsetY = (containerH - displayH) / 2
            }else{
              // Image taller than container
              displayH = containerH
              displayW = containerH * imageAspect
              offsetX = (containerW - displayW) / 2
              offsetY = 0
            }
            
            const {x0,y0,x1,y1} = b.bbox
            const scaleX = displayW / naturalW
            const scaleY = displayH / naturalH
            
            const left = `${offsetX + x0 * scaleX}px`
            const top = `${offsetY + y0 * scaleY}px`
            const width = `${(x1 - x0) * scaleX}px`
            const height = `${(y1 - y0) * scaleY}px`
            const handleMouseEnter = (e) => {
              handleHotspotHover(b.text);
            }
            
            return (
              <button
                key={i}
                onClick={()=>handleClick(b)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleHotspotLeave}
                className={`absolute hotspot${showHotspotBorder ? ' with-border' : ''}`}
                style={{left,top,width,height}}
                aria-label={b.text}
                title={b.text}
              >
                <span className="hs-label">
                  {hoveredText === b.text ? (
                    <>
                      <div style={{fontWeight: '500', marginBottom: '0.25rem'}}>{b.text}</div>
                      {hoveredPhonetics && <div style={{fontStyle: 'italic', color: '#bfdbfe', marginBottom: '0.25rem'}}>{hoveredPhonetics}</div>}
                      <div style={{color: '#e5e7eb'}}>{hoveredTranslation}</div>
                    </>
                  ) : (
                    b.text
                  )}
                </span>
              </button>
            )
          })}

          {loading && (
            <div className="overlay-center">
              <Spinner />
            </div>
          )}

          {error && (
            <div className="absolute bottom-2 left-2 bg-red-50 border border-red-200 text-red-800 p-2 rounded">{error}</div>
          )}
        </div>
      )}
    </div>
  )
}
