export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const {text, source='auto', target='zh'} = req.body || {}
  if(!text) return res.status(400).json({error:'missing text'})

  try{
    // Prefer Google Translate if API key is provided
    const GOOGLE_KEY = process.env.GOOGLE_API_KEY
    if(GOOGLE_KEY){
      try{
        const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_KEY}`
        const body = { q: text, target, format: 'text' }
        if(source && source !== 'auto') body.source = source
        const resp = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(5000)
        })
        const j = await resp.json()
        const translated = j && j.data && j.data.translations && j.data.translations[0] && j.data.translations[0].translatedText
        if(translated) {
          console.log('✓ Google翻译成功')
          return res.status(200).json({translation: translated})
        }
      }catch(e){
        console.error('✗ Google翻译失败:', e.message)
      }
    }

    // Fallback 1: MyMemory API
    try{
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`
      const resp = await fetch(url, {signal: AbortSignal.timeout(5000)})
      const j = await resp.json()
      if(j.responseStatus === 200 && j.responseData && j.responseData.translatedText){
        console.log('✓ MyMemory翻译成功')
        return res.status(200).json({translation: j.responseData.translatedText})
      }
    }catch(e){
      console.error('✗ MyMemory翻译失败:', e.message)
    }

    // Fallback 2: Using a simple translation - just return the text with a note
    // or use another free API
    console.warn('所有翻译服务失败，返回原文本')
    return res.status(200).json({translation: `[${target}] ${text}`})
  }catch(e){
    console.error('Translation handler error:', e)
    return res.status(200).json({translation: text})
  }
}
