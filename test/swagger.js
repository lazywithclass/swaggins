describe('convert', function() {

  var lib = require('../lib/swagger'),
      expect = require('chai').expect,
      request = require('request');

  it('exists', () => {
    expect(lib.convert).to.exist;
  });

  it('converts http methods', (done) => {
    request('http://localhost:3000/scoreboard', (_, res) => {
      var converted = lib.convert(res);
      var expected = {
        paths: {
          '/scoreboard': {
            get: {
              responses: {
                200: {
                  headers: {
                    'x-powered-by': 'Express',
                    'content-type': 'application/json; charset=utf-8'
                  }
                }
              }
            }
          }
        }
      };

      expect(converted).to.deep.equal(expected);
      done();
    });
  });

  it('returns custom headers and content type', function(done) {
    request.post('http://localhost:3000/scoreboard', (_, res) => {
      var converted = lib.convert(res);
      var expected = {
        paths: {
          '/scoreboard': {
            post: {
              responses: {
                201: {
                  headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'x-powered-by': 'Express',
                    'x-server-load': 'ok'
                  }
                }
              }
            }
          }
        }
      };

      expect(converted).to.deep.equal(expected);
      done();
    });
  });

});
