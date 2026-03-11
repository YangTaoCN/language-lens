import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import Home from '../index'

test('renders language selectors and upload input', ()=>{
  const {container} = render(<Home />)
  expect(screen.getByText('学习语言')).toBeInTheDocument()
  expect(screen.getByText('目标语言')).toBeInTheDocument()
  expect(screen.getByText('上传图片')).toBeInTheDocument()
  const fileInput = container.querySelector('input[type=file]')
  expect(fileInput).toBeTruthy()
})
