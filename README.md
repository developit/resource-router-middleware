# resource-router-middleware

[![NPM](http://img.shields.io/npm/v/resource-router-middleware.svg)](https://www.npmjs.com/package/resource-router-middleware)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/developit/resource-router-middleware)

> Express REST resources as middleware, mountable anywhere.


## Usage


### In ES6

```js
import resource from 'resource-router-middleware';

export default resource({
	id : 'user',

	load(req, id, callback) {
		var user = users.find( user => user.id===id ),
			err = user ? null : 'Not found';
		callback(err, user);
	},

	list({ params }, res) {
		res.json(users);
	},

	create({ body }, res) {
		body.id = users.length.toString(36);
		users.push(body);
		res.json(body);
	},

	read({ user }, res) {
		res.json(user);
	},

	update({ user, body }, res) {
		for (let key in body) {
			if (key!=='id') {
				user[key] = body[key];
			}
		}
		res.status(204).send();
	},

	delete({ user }, res) {
		users.splice(users.indexOf(user), 1);
		res.status(204).send();
	}
});
```


### In ES5

```js
var resource = require('resource-router-middleware');

var users = [];

module.exports = resource({
	/** Property name to store preloaded entity on `request`. */
	id : 'user',

	/** For requests with an `id`, you can auto-load the entity.
	 *	Errors terminate the request, success sets `req[id] = data`.
	 */
	load : function(req, id, callback) {
		var user = users.filter(function(user){ return user.id===id; })[0];
		if (!user) {
			callback('Not found');
		}
		else {
			callback(null, user);
		}
	},

	/** GET / - List all entities */
	list : function(req, res) {
		res.json(users);
	},

	/** POST / - Create a new entity */
	create : function(req, res) {
		var user = req.body;
		user.id = users.length.toString(36);
		users.push(user);
		res.json(user);
	},

	/** GET /:id - Return a given entity */
	read : function(req, res) {
		res.json(req.user);
	},

	/** PUT /:id - Update a given entity */
	update : function(req, res) {
		var id = req.params[this.id];

		for (var i=users.length; i--; ) {
			if (users[i].id===id) {
				users[i] = req.body;
				users[i].id = id;
				return res.status(204).send('Accepted');
			}
		}
		res.status(404).send('Not found');
	},

	/** DELETE /:id - Delete a given entity */
	delete : function(req, res) {
		var id = req.params[this.id];

		for (var i=users.length; i--; ) {
			if (users[i].id===id) {
				users.splice(i, 1);
				return res.status(200);
			}
		}

		res.status(404).send('Not found');
	}
});
```
