const parsePopulateString = require('../../lib/parsePopulateString')

describe('Test parsePopulateString', () => {
   it('syntax: onlyOne', () => {
      expect(parsePopulateString('creator<-users')).toEqual({
         localField: 'creator',
         foreignField: '_id',
         from: 'users',
         onlyOne: true
      })
   })

   it('syntax: all', () => {
      expect(parsePopulateString('creator<=users')).toEqual({
         localField: 'creator',
         foreignField: '_id',
         from: 'users',
         onlyOne: false
      })
   })

   it('syntax: foreignKey', () => {
      expect(parsePopulateString('creator<-users.phone')).toEqual({
         localField: 'creator',
         foreignField: 'phone',
         from: 'users',
         onlyOne: true
      })
   })

   it('should work with space', () => {
      expect(parsePopulateString('creator <- users')).toEqual({
         localField: 'creator',
         foreignField: '_id',
         from: 'users',
         onlyOne: true
      })
   })
})
