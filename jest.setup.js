require('@testing-library/jest-dom')

// minimal mocks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

// polyfill fetch for test environment
if(typeof global.fetch === 'undefined'){
  try{
    global.fetch = require('cross-fetch')
  }catch(e){}
}
