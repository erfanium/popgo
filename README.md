# POPGO

**MongoDB + Populates**

-  5.5 times faster than mongoose populate!
-  No dependencies
-  Uses aggregation
-  Native API's without any changes
-  Both find & findOne methods

```js
db.collection('posts')
   .find(
      {},
      { populate: 'creator <- users' } // {field} <- {targetCollection}
   )
   .toArray()

/*
[
	{
		_id: '5e84cee156616779991d2cd1',
		text:  'My second post',
		creator: {
			_id: '5e84cee156616779991d2cd2'
			name:  'Hassan'
		}
	},
	{
		_id: '5e84cee156616779991d2cd3',
		text:  'My first post',
		creator: {
			_id: '5e84cee156616779991d2cd3'
			name:  'Erfan'
		}
	}
]
*/
```

To install:

```js
npm i popgo
// or
yarn add popgo
```

## Hello World

```js
const mongodb = require('mongodb')
const popgo = require('popgo')(mongodb)

popgo
   .connect('mongodb://localhost:27017/popgo:test')
   .then(async c => {
      const db = c.db()
      const result = await db
         .collection('posts')
         .findOne(
            { text: 'My first post' }, 
            { populate: 'creator <- users' }
         )
})
```

## More syntax samples

**" <- "** = Populate only first matched Item

```js
db.collection('posts').findOne(
   { text: 'My first post' },
   { populate: 'creator <- users' } // {field} <- {targetCollection}
)

/*
{
	_id: '5e84cee156616779991d2cd1',
	text:  'My second post',
	creator: {
		_id: '5e84cee156616779991d2cd2'
		name:  'Erfan'
	}
}
*/
```

**" <= "** = Populate all matched Items:

```js
db.collection('posts').findOne(
   { text: 'My first post' },
   { populate: 'creator <= users' } // {field} <= {targetCollection}
)

/*
{
	_id: '5e84cee156616779991d2cd1',
	text:  'My second post',
	creator: [{
		_id: '5e84cee156616779991d2cd2'
		name:  'Erfan'
	}]
}
*/
```

**Multi population:**

```js
db
   .collection('posts')
   .findOne(
      { text: 'My first post' }, 
      { populate: ['creator <- users', 'partner <- partners'] }
   )

/*
{
	_id: '5e84cee156616779991d2cd1',
	text:  'My second post',
	partner: {
		_id: '5e84cee156616779991d2cd6',
		name: 'x'
	},
	creator: {
		_id: '5e84cee156616779991d2cd2'
		name:  'Erfan'
	}
}
*/
```

**Populate with custom foreignFields:**

```js
db.collection('posts').findOne(
   { text: 'My first post' },
   { populate: 'phone <- users.phone' } // {field} <- {targetCollection}.{foreignKey}
)

/*
{
	_id: '5e84cee156616779991d2cd1',
	text:  'My second post',
	phone: {
		_id: '5e84cee156616779991d2cd6',
		name: 'x'
	},
}
*/
```
