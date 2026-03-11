// Common English words with IPA phonetics
const phoneticsDB = {
  'hello': 'həˈloʊ',
  'world': 'wɜːld',
  'thank': 'θæŋk',
  'thanks': 'θæŋks',
  'you': 'juː',
  'please': 'pliːz',
  'help': 'help',
  'water': 'ˈwɔːtər',
  'food': 'fuːd',
  'book': 'bʊk',
  'table': 'ˈteɪbəl',
  'chair': 'tʃer',
  'cat': 'kæt',
  'dog': 'dɔːɡ',
  'apple': 'ˈæpəl',
  'orange': 'ˈɔrɪndʒ',
  'good': 'ɡʊd',
  'bad': 'bæd',
  'big': 'bɪɡ',
  'small': 'smɔːl',
  'hot': 'hɑːt',
  'cold': 'koʊld',
  'happy': 'ˈhæpi',
  'sad': 'sæd',
  'morning': 'ˈmɔːrnɪŋ',
  'evening': 'ˈiːvnɪŋ',
  'night': 'naɪt',
  'day': 'deɪ',
  'beautiful': 'ˈbjuːtəfl',
  'wonderful': 'ˈwʌndərfl',
  'today': 'təˈdeɪ',
  'tomorrow': 'təˈmɑroʊ',
  'yesterday': 'ˈjestərdeɪ',
  'friend': 'frend',
  'family': 'ˈfæməli',
  'house': 'haʊs',
  'school': 'skuːl',
  'teacher': 'ˈtitʃər',
  'student': 'ˈstjuːdənt',
  'work': 'wɜːrk',
  'play': 'pleɪ',
  'run': 'rʌn',
  'walk': 'wɔːk',
  'eat': 'iːt',
  'drink': 'drɪŋk',
  'sleep': 'sliːp',
  'love': 'lʌv',
  'hate': 'heɪt',
  'like': 'laɪk',
  'hate': 'heɪt',
  'yes': 'jɛs',
  'no': 'noʊ',
  'okay': 'oʊˈkeɪ',
  'sorry': 'ˈsɑri',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, lang } = req.body;

  if (!text) {
    return res.status(200).json({ phonetics: '' });
  }

  console.log(`[Phonetics] Fetching for: ${text}, lang: ${lang}`);

  try {
    // For English, check local database first
    if (lang === 'en') {
      const lowerText = text.toLowerCase().trim().replace(/[^a-z0-9]+$/g, '');
      
      // Check exact match in database
      if (phoneticsDB[lowerText]) {
        const phonetic = phoneticsDB[lowerText];
        console.log(`[Phonetics] Found in DB: ${phonetic}`);
        return res.status(200).json({ phonetics: `/${phonetic}/` });
      }

      // Try to fetch from Free Dictionary API
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/english/${encodeURIComponent(lowerText)}`,
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          
          if (Array.isArray(data) && data.length > 0) {
            const entry = data[0];
            if (entry && entry.phonetics && Array.isArray(entry.phonetics)) {
              // Get the first phonetic entry that has text
              for (let p of entry.phonetics) {
                if (p.text) {
                  console.log(`[Phonetics] Found from API: ${p.text}`);
                  return res.status(200).json({ phonetics: p.text });
                }
              }
            }
          }
        }
      } catch (fetchError) {
        console.log(`[Phonetics] API fetch failed:`, fetchError.message);
      }
      
      console.log(`[Phonetics] No phonetics found for ${text}`);
      return res.status(200).json({ phonetics: '' });
    }

    // For Japanese, return empty (can be extended)
    if (lang === 'ja') {
      return res.status(200).json({ phonetics: '' });
    }

    // For other languages
    return res.status(200).json({ phonetics: '' });
  } catch (error) {
    console.error('[Phonetics] Unexpected error:', error.message);
    return res.status(200).json({ phonetics: '' });
  }
}
