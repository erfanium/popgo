const parsePopulateString = require('./parsePopulateString')
const cacher = require('./cacher')

function createFromRules(populateRules) {
   const pipelines = []
   let set

   populateRules.forEach(rule => {
      const { localField, from, foreignField } = rule

      pipelines.push({
         $lookup: {
            from,
            localField,
            foreignField,
            as: localField
         }
      })

      if (rule.onlyOne) {
         if (!set) set = {}
         set[localField] = {
            $arrayElemAt: ['$' + localField, 0]
         }
      }
   })

   if (set) {
      pipelines.push({
         $set: set
      })
   }

   return pipelines
}

exports.addAggPipelines = function(pStrings, pipelines = []) {
   if (typeof pStrings === 'string') pStrings = [pStrings]

   const cacheLookupPipelines = cacher.get(pStrings)

   if (cacheLookupPipelines) {
      return pipelines.push(...cacheLookupPipelines)
   }

   const populateRules = pStrings.map(parsePopulateString)
   const lookupPipelines = createFromRules(populateRules)
   cacher.cache(pStrings, lookupPipelines)

   return pipelines.push(...lookupPipelines)
}

exports.createFromRules = createFromRules
