function rowsToObjs(rows, removeDollor, splitKey) {
  if(!splitKey){
    splitKey = '_'
  }
  var retJSON = null
  rows.forEach((row) => {
    var rowJson = {}
    Object.keys(row).forEach(key => {
      var splitted = key.split(splitKey)
      var val = row[key]
      var atLevel = rowJson
      splitted.forEach((level, idx) => {
        var arrayLevel = false

        // eslint-disable-next-line
        if (level.substr(0, 1) == '$') {
          arrayLevel = true
          if (removeDollor === true)
            level = level.substr(1)
        }

        if (arrayLevel) {
          atLevel[level] = atLevel[level] || [{}]
        } else {
          atLevel[level] = atLevel[level] || {}
        }

        // eslint-disable-next-line        
        if (idx == (splitted.length - 1)) {
          atLevel[level] = val
        } else {
          if (arrayLevel) {
            atLevel = atLevel[level][atLevel[level].length - 1]
          } else {
            atLevel = atLevel[level]
          }
        }
      })
    })

    if (!retJSON) {
      retJSON = rowJson
    } else {
      var funcy = (json, singleJson, lastArr) => {
        if (lastArr != null && json.id && json.id !== singleJson.id) {
          return true
        }

        Object.keys(json).forEach((key, i) => {
          if (Array.isArray(json[key])) {
            var inserted = true
            json[key].forEach((elem, j) => {
              inserted = inserted && funcy(elem, singleJson[key][0], json[key])
            })
            if (inserted) {
              json[key].push(singleJson[key][0])
              return false
            }
          } else if (json[key] != null && typeof json[key] === 'object' && !json[key]._isAMomentObject) {
            funcy(json[key], singleJson[key], lastArr)
          }
        })

        return false
      }

      funcy(retJSON, rowJson, null)
    }
  })
  return retJSON
}

module.exports = rowsToObjs
