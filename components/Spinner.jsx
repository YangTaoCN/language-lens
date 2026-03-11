import React from 'react'

export default function Spinner({className}){
  return <div className={['spinner', className].filter(Boolean).join(' ')} aria-hidden="true" />
}
