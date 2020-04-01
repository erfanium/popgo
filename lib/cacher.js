const caches = {}

exports.cache = function(pStrings, value) {
   const key = pStrings.join('|')
   caches[key] = value
}

exports.get = function(pStrings) {
   return caches[pStrings.join('|')]
}
