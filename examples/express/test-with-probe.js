var request = require('request'),
    expect = require('chai').expect;

require('../../index').probe();

describe('server', function() {

  it('answers to /answer with 42', function(done) {
    request(
      'http://localhost:1337/answer/everything',
      function cb(err, res, body) {
        expect(body).to.equal('42');
        done();
      }
    );

  });

});
