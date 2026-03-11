const recognizeMock = jest.fn((imageSrc, lang, opts) => {
  return Promise.resolve({ data: { words: [ { text: 'テスト', bbox: { x0: 10, y0: 10, x1: 50, y1: 30 } }, { text: '単語', bbox: { x0: 60, y0: 40, x1: 100, y1: 70 } } ] } })
})

module.exports = {
  recognize: recognizeMock,
  default: { recognize: recognizeMock }
}
