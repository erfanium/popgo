const natives = {}
const { addAggPipelines } = require('./lib/createAggPipelines')

module.exports = function(mongodb) {
   const { Collection } = mongodb
   natives.findOne = Collection.prototype.findOne
   natives.find = Collection.prototype.find

   Collection.prototype.findOne = function(...args) {
      const options = args[1]
      if (!options || typeof options === 'function' || !options.populate) return natives.findOne.call(this, ...args)

      let pipelines = [{ $limit: 1 }]
      addAggPipelines(options.populate, pipelines)
      if (options.sort) pipelines.push({ $sort: options.sort })
      if (options.projection) pipelines.push({ $project: options.projection })

      return Collection.prototype.aggregate
         .call(this, pipelines)
         .toArray()
         .then(a => a[0])
   }

   Collection.prototype.find = function(...args) {
      const options = args[1]
      if (!options || typeof options === 'function' || !options.populate) return natives.find.call(this, ...args)

      let pipelines = []
      addAggPipelines(options.populate, pipelines)
      if (options.projection) pipelines.push({ $project: options.projection })

      return Collection.prototype.aggregate.call(this, pipelines)
   }

   return mongodb
}
