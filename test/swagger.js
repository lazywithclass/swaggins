describe('convert', function() {

  var lib = require('../lib/swagger'),
      expect = require('chai').expect,
      request = require('request');

  it('exists', () => {
    expect(lib.convert).to.exist;
  });

  it.only('converts http methods', (done) => {
    request('http://localhost:3000/scoreboard', (_, res) => {
      var converted = lib.convert(res);
      var expected = {
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
      };

      expect(converted.path).to.deep.equal('/scoreboard');
      expect(converted.method).to.deep.equal('get');
      expect(converted.call).to.deep.equal(expected);
      done();
    });
  });

  it('returns custom headers and content type', function(done) {
    request.post('http://localhost:3000/scoreboard', (_, res) => {
      var converted = lib.convert(res);
      var expected = {
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
      };

      expect(converted[2]).to.deep.equal(expected);
      done();
    });
  });

});
