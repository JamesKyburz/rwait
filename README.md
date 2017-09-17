# rwait

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![npm](https://img.shields.io/npm/v/rwait.svg)](https://npmjs.org/package/rwait)
[![downloads](https://img.shields.io/npm/dm/rwait.svg)](https://npmjs.org/package/rwait)

## Usage

```js
const r = require('rethinkdbdash')({ host: 'localhost' })
const rwait = require('rwait')(r)

;(async () => {
  try {
    const pending = await rwait({
      db: 'test',
      table: 'test',
      timeout: 2000,
      filter: r.row('new_val')('id').eq('test')
    })

    // some operation that causes a write somewhere else....
    process.nextTick(() => {
      r.db('test').table('test').insert([ { id: 'test', value: 'hello world' } ]).run()
    })

    const value = await pending.value
    console.log('got value', value)
  } catch (err) {
    console.error('error', err)
  }
})()
```

# license

[Apache License, Version 2.0](LICENSE)
