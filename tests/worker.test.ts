import { readdirSync } from 'fs'
import path from 'path'
import { expect, test } from 'vitest'

test('Worker correctly highlights Javascript code', async () => {
  const { Tinypool } = await import('tinypool')

  const exampleToken = {
    code: 'console.log("hello world")',
    language: 'javascript',
  }

  const workerPool = new Tinypool({
    filename: path.resolve('dist/worker.js'),
    minThreads: 0,
    idleTimeout: 60,
  })
  const { tokens } = await workerPool.run(exampleToken)

  expect(tokens).toMatchInlineSnapshot(`
    [
      [
        {
          "color": "#FFFF08",
          "content": "console",
        },
        {
          "color": "#FFFF05",
          "content": ".",
        },
        {
          "color": "#FFFF0D",
          "content": "log",
        },
        {
          "color": "#FFFF05",
          "content": "(",
        },
        {
          "color": "#FFFF05",
          "content": "\\"",
        },
        {
          "color": "#FFFF0B",
          "content": "hello world",
        },
        {
          "color": "#FFFF05",
          "content": "\\"",
        },
        {
          "color": "#FFFF05",
          "content": ")",
        },
      ],
    ]
  `)
})
