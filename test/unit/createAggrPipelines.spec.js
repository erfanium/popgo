const { createFromRules } = require('../../lib/createAggPipelines')

describe('test createFromRules', () => {
   it('should work with simple', () => {
      expect(
         createFromRules([
            {
               localField: 'creator',
               foreignField: '_id',
               from: 'users',
               onlyOne: false
            }
         ])
      ).toEqual([
         {
            $lookup: {
               from: 'users',
               localField: 'creator',
               foreignField: '_id',
               as: 'creator'
            }
         }
      ])
   })

   it('should add project pipeline an onlyOne=true', () => {
      expect(
         createFromRules([
            {
               localField: 'creator',
               foreignField: '_id',
               from: 'users',
               onlyOne: true
            }
         ])
      ).toEqual([
         {
            $lookup: {
               from: 'users',
               localField: 'creator',
               foreignField: '_id',
               as: 'creator'
            }
         },
         {
            $set: {
               creator: {
                  $arrayElemAt: ['$creator', 0]
               }
            }
         }
      ])
   })

   it('should work with multiple rules', () => {
      expect(
         createFromRules([
            {
               localField: 'creator',
               foreignField: '_id',
               from: 'users',
               onlyOne: true
            },
            {
               localField: 'partner',
               foreignField: '_id',
               from: 'partners',
               onlyOne: true
            }
         ])
      ).toEqual([
         {
            $lookup: {
               from: 'users',
               localField: 'creator',
               foreignField: '_id',
               as: 'creator'
            }
         },
         {
            $lookup: {
               from: 'partners',
               localField: 'partner',
               foreignField: '_id',
               as: 'partner'
            }
         },
         {
            $set: {
               creator: {
                  $arrayElemAt: ['$creator', 0]
               },
               partner: {
                  $arrayElemAt: ['$partner', 0]
               }
            }
         }
      ])
   })
})
