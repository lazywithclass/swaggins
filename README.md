# swaggins

Swaggins serves Swagger docs from your integration tests, no need to maintain both, because YOLO.

### How

Swaggins extract useful information for your Swagger docs from the
`res` object, so it provides a wrapper that your can use in your
tests to give it the information it needs.

### Install

`-g` is optional, you might want to do it for when you
use `swaggins` from the CLI.

`npm install swaggins`

### Usage

Have a look at [the express example](https://github.com/lazywithclass/swaggins/tree/master/examples/express)
but ideally you would have to do the following steps

 * [configure-your-tests](#configure-your-tests)
 * [run your tests](#run-your-tests), you get the JSON swagger definition
 * [prepare the docs folder](#prepare-the-docs-folder) with the JSON
 * [serve](#serve) your docs

#### Configure your tests

All swaggins needs is a wrapper around the `res` object, so your
tests might look something like this

```javascript
it('answers to /answer with 42', function(done) {
  request(
    'http://localhost:3000/answer/everything',
    function cb(err, res, body) {
      extract(res); <--- this is where we use swaggins
      expect(body).to.equal('42');
      done();
    }
  );
});
```

The [complete example](https://github.com/lazywithclass/swaggins/blob/master/examples/express/test.js) is in the examples folder.

#### Run your tests

In the examples folder I've provided a [very basic example](https://github.com/lazywithclass/swaggins/blob/master/examples/express/run-me.sh),
swaggins expects you to run your integration tests against
a real server, so that it can get the real response and extract the info

#### Prepare the docs folder

At this point I assume you have the JSON definition, so just run

```bash
$ swaggins doc
```

to get your JSON and swagger-ui in `docs/`.

#### Serve

Show your API docs

```bash
$ swaggins serve
```
