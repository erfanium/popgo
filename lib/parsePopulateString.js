module.exports = function(s) {
   s = s.replace(/\s+/g, '')
   let arr

   const o = {
      foreignField: '_id'
   }

   if (s.includes('<-')) {
      o.onlyOne = true
      arr = s.split('<-')
   } else if (s.includes('<=')) {
      o.onlyOne = false
      arr = s.split('<=')
   } else throw new Error('syntax not found')

   let [localField, from] = arr
   o.localField = localField

   if (from.includes('.')) {
      const [collectionName, foreignField] = from.split('.')
      from = collectionName
      o.foreignField = foreignField
   }
   o.from = from

   return o
}
