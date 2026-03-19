import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import Home from '../pages/index'

test('renders language selectors and upload input', ()=>{
  const {container} = render(<Home />)
  expect(screen.getByText('学习语言')).toBeInTheDocument()
  expect(screen.getByText('你的语言 (Your Language)')).toBeInTheDocument()
  expect(screen.getByText('上传图片')).toBeInTheDocument()
  const fileInput = container.querySelector('input[type=file]')
  expect(fileInput).toBeTruthy()
})
