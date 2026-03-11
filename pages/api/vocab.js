import fs from 'fs'
import {promises as fsp} from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'vocab.json')

async function ensureFile(){
  try{
    await fsp.mkdir(DATA_DIR, {recursive: true})
    await fsp.access(FILE)
  }catch(e){
    await fsp.writeFile(FILE, '[]', 'utf8')
  }
}

async function readVocab(){
  await ensureFile()
  const txt = await fsp.readFile(FILE, 'utf8')
  try{
    return JSON.parse(txt || '[]')
  }catch(e){
    return []
  }
}

async function writeVocab(arr){
  await ensureFile()
  await fsp.writeFile(FILE, JSON.stringify(arr, null, 2), 'utf8')
}

export default async function handler(req, res){
  await ensureFile()
  if(req.method === 'GET'){
    const v = await readVocab()
    return res.status(200).json({vocab: v})
  }

  if(req.method === 'POST'){
    const item = req.body
    if(!item || !item.text) return res.status(400).json({error:'missing text'})
    const v = await readVocab()
    // dedupe by text
    const filtered = v.filter(i=>i.text !== item.text)
    filtered.unshift(item)
    await writeVocab(filtered)
    return res.status(200).json({vocab: filtered})
  }

  if(req.method === 'DELETE'){
    const {text} = req.body || {}
    if(!text) return res.status(400).json({error:'missing text'})
    const v = await readVocab()
    const filtered = v.filter(i=>i.text !== text)
    await writeVocab(filtered)
    return res.status(200).json({vocab: filtered})
  }

  res.setHeader('Allow', 'GET,POST,DELETE')
  res.status(405).end()
}
