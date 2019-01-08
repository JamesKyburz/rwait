module.exports = r => (connection, options) => {
  if (!options) {
    options = connection
    connection = undefined
  }
  const { db, table, timeout, filter } = options
  return new Promise((resolve, reject) => {
    const done = (err, cursor) => {
      if (err) return reject(err)
      resolve({
        value: new Promise((resolve, reject) => {
          let timer
          if (timeout) {
            timer = setTimeout(() => reject(new Error('timeout')), timeout)
          }
          cursor.each((err, res) => {
            if (err) return reject(err)
            if (timer) clearTimeout(timer)
            cursor.close().catch(f => f)
            resolve(res.new_val)
          })
        })
      })
    }
    r
      .db(db)
      .table(table)
      .changes()
      .filter(filter)
      .run(...(connection ? [connection, done] : [done]))
      .catch(reject)
  })
}
