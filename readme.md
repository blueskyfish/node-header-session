
BlueSkyFish &copy; 2015

# Node Rest Header Session

The middleware creates a simple session management via a HTTP header field that contains a token. This is for a stateless RESTful service.

## Usage

```js
var
	express = require('express'),
	restHeader = require('node-rest-header-session');

var
	app = express();

// register the middleware and the metrics request.
restHeader(app, {
	name: 'x-this-is-a-restful-header-field',
	debug: true,
	metricsUrl: '/metrics/rest-header'
	genToken: function () {
		return // generate a unique id / token (may UUID())
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


app.listen(3000, function () {
	console.log('server is started...');
});
```


## Options

The middleware will be configured with some options

Name             | Kind     | Description
-----------------|----------|----------------------------------------------
name             | string   | The header name for the session management (**Default** `x-rest-session-token`).
debug            | boolean  | Show debug messages with `console.log` (**Default**: `true`).
metricsUrl       | string   | The url für the metrics information. (**Default**: undefined)
genToken         | function | The function for generate the token uuid (**Default**: undefined)


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
