const { MongoClient } = require('../../index')(require('mongodb'))

let db
let posts
let users

beforeAll(async () => {
   const client = new MongoClient('mongodb://localhost:27017/popgo')
   await client.connect()
   db = client.db()

   try {
      await db.collection('posts').drop()
      await db.collection('users').drop()
      await db.createCollection('posts')
      await db.createCollection('users')
      // eslint-disable-next-line no-empty
   } catch (e) {
      console.log(e)
   }

   posts = db.collection('posts')
   users = db.collection('users')

   await users.insertOne({ name: 'Erfan' }).then(result => {
      posts.insertOne({
         creator: result.insertedId,
         text: 'My first post',
         v: 2
      })
   })

   await users.insertOne({ name: 'Hassan' }).then(result => {
      posts.insertOne({
         creator: result.insertedId,
         text: 'My second post',
         v: 1
      })
   })
})

describe('Populate', () => {
   it('should populate on findOne', async () => {
      const p = await posts.findOne(
         { text: 'My first post' },
         {
            populate: 'creator <- users'
         }
      )

      expect(p).toBeTruthy()
      delete p._id

      expect(p.creator._id).toBeTruthy()
      delete p.creator._id

      expect(p).toEqual({
         text: 'My first post',
         creator: {
            name: 'Erfan'
         },
         v: 2
      })
   })

   it('should populate on find', async () => {
      const postsResult = await posts
         .find(
            {},
            {
               populate: 'creator <- users'
            }
         )
         .sort({ v: 1 })
         .toArray()

      postsResult.forEach(p => {
         expect(p).toBeTruthy()
         delete p._id
         expect(p.creator._id).toBeTruthy()
         delete p.creator._id
      })

      expect(postsResult).toEqual([
         {
            text: 'My second post',
            v: 1,
            creator: {
               name: 'Hassan'
            }
         },
         {
            text: 'My first post',
            v: 2,
            creator: {
               name: 'Erfan'
            }
         }
      ])
   })
})
