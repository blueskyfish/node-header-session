
BlueSkyFish &copy; 2015

# Node Rest Header Session

The middleware creates a simple session management via a HTTP header field that contains a token. This is for a stateless RESTful service.

## Usage

```js
var
	express = require('express'),
	bodyParser = require('body-parser'),
	restHeader = require('node-rest-header-session');

var
	app = express();

// register the middleware and the metrics request.
restHeader(app, {
	name: 'x-this-is-a-restful-header-field',
	debug: true,
	metrics: {
		enable: true,
		url: '/metrics/rest-header'
	}
});

// every request
app.get('/', function (req, res) {
	var count = req.restSession.count || 0;

	req.restSession.count = ++count;

	res.send({
		count: count
	});
});
```


## Options

The middleware will be configured with some options

Name             | Kind     | Description
-----------------|----------|----------------------------------------------
name             | string   | The header name for the session management (**Default** `x-rest-session-token`).
debug            | boolean  | Show debug messages with `console.debug` (**Default**: `true`).
metrics.enable   | boolean  | Add a metrics url for the session values (**Default**: `false`).
metrics.url      | string   | The url für the metrics information (**Default** `/metrics/rest-header`)


## Routemap

* add a timeout for the rest session
* improve the metrics output
* write tests
* session values to a storage object  
  * MemoryStorage
  * FileStorage
  * and more...
* create a own token generator function

If an important feature is missing or you find an error, please create an Issue <https://github.com/blueskyfish/node-rest-header-session/issues>


## License

	The MIT License (MIT)

	Copyright (c) 2015 BlueSkyFish <blueskyfish@kirchnerei.de>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
