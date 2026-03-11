jest.mock('tesseract.js')

import React from 'react'
import {render, screen, waitFor, fireEvent} from '@testing-library/react'
import Tesseract from 'tesseract.js'
import ImageAnnotator from '../ImageAnnotator'

test('renders hotspots and calls onSelect when clicked', async ()=>{
  const onSelect = jest.fn()
  const mockEngine = { recognize: jest.fn(() => Promise.resolve({ data: { words: [ { text: 'テスト', bbox: { x0:10,y0:10,x1:50,y1:30 } } ] } })) }
  render(<ImageAnnotator imageSrc={"data:image/png;base64,AAA"} sourceLang={'ja'} onSelect={onSelect} ocr={mockEngine} onOcrState={()=>{}} />)

  // wait for mock recognize to resolve and hotspots to render
  await waitFor(()=>{
    expect(mockEngine.recognize).toHaveBeenCalled()
  })

  const btn = await screen.findByTitle('テスト')
  expect(btn).toBeInTheDocument()
  fireEvent.click(btn)
  expect(onSelect).toHaveBeenCalledWith('テスト')
})
