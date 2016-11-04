# swaggins [v0.7.1](https://github.com/lazywithclass/swaggins/blob/master/CHANGELOG.md#071)

Serve Swagger docs from your integration tests, no need to maintain both, because YOLO.

[![Dependency Status](https://david-dm.org/lazywithclass/swaggins.svg)](https://david-dm.org/lazywithclass/swaggins) [![dev dependencies](https://david-dm.org/lazywithclass/swaggins/dev-status.svg)](https://david-dm.org/lazywithclass/swaggins#info=devDependencies) [![peer dependencies](https://david-dm.org/lazywithclass/swaggins/peer-status.svg)](https://david-dm.org/lazywithclass/swaggins#info=peerDependencies)

### How

Swaggins extracts useful information for your [Swagger](http://swagger.io/) docs from Node.js HTTP `res` object.

Information extracted includes:

 * `path` of the endpoint
 * `method`(s) that the endpoint supports
 * `statusCode` returned by the call to the endpoint
 * `body` either passed to the endpoint (via POST) for example, or received from the endpoint
 
Have a look at an [example of the generated documentation](http://lazywithclass.github.io/swaggins/examples/express/docs).

### Install

`-g` is optional, you might want to do it for when you
use `swaggins` from the CLI.

```bash
$ npm install swaggins
```

### Usage

Have a look at [the express example](https://github.com/lazywithclass/swaggins/tree/master/examples/express)
but ideally you would have to do the following steps

 * [configure your tests](#configure-your-tests)
 * [run your tests](#run-your-tests), so you get the JSON swagger definition
 * [prepare the docs folder](#prepare-the-docs-folder) with the JSON
 * [serve](#serve) your docs

#### Configure your tests

There are two ways to do so:

 * [`probe`](#probe): proxying Node.js `http.request` once at the top of your test
 * [`extract`](#extract): passing `res` everytime you need

If you need to pass in extra information that you want to be added to the documentation
you could use the following headers:

 * `x-swaggins-endpoint-description` - the endpoint description, will be at the top under "Implementation Notes"
 * `x-swaggins-status-description` - the status description, will be under "Response Class"
 * `x-swaggins-tag` - dictates in which group this endpoint will fall into
 * `x-swaggins-path` - uses what you provide as path, so you could have a URL that reads like `'/api/answers/{answer-id}'` or simply `'/api/answers{id}'`, as you prefer

If you want to ignore a call just add `x-swaggins-ignore` to your headers.

##### probe

Include this line at the top of your test and you're good to go:

```javascript
require('swaggins').probe();
```

It makes sense to include it just once for all your test, it proxies `http.request` so there's no reason to do it twice.

[Example](https://github.com/lazywithclass/swaggins/tree/master/examples/express/test-with-probe.js#L4)

##### extract

Pass `res` only where you need:

```javascript
var extract = require('swaggins').extract;

it('answers to /answer with 42', function(done) {
  request(
    'http://localhost:3000/answer/everything',
    function cb(err, res, body) {
      extract(res); <--- here is where we use swaggins
      expect(body).to.equal('42');
      done();
    }
  );
});
```

[Example](https://github.com/lazywithclass/swaggins/blob/master/examples/express/test-with-extract.js#L12)

#### Run your tests

In the examples folder I've provided a [very basic example](https://github.com/lazywithclass/swaggins/blob/master/examples/express/run-me.sh),
Swaggins expects you to run your integration tests against
a real server, so that it can get `res` and extract the information.

#### Prepare the docs folder

At this point I assume you have the JSON definition, so just run

```bash
$ swaggins doc
```

to get your JSON definition and swagger-ui in `docs/`.

#### Serve

Show your API docs

```bash
$ swaggins serve
```

This will run the server on port 8080, if you want to change that just pass the port as argument

```bash
$ swaggins serve 3000
```
