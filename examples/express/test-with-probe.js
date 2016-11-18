var request = require('request'),
    expect = require('chai').expect;

require('../../index').probe();

describe('server', function() {

  describe('answer', function() {

    it('answers to /answer with 42', function(done) {
      var options = {
        headers: {
          'x-swaggins-tag': 'answer',
          'x-swaggins-path': '/answer/{about}',
          'x-swaggins-endpoint-description': 'The answer to life the universe and everything'
        },
        uri: 'http://localhost:1337/answer/everything'
      };
      request(options, function(err, res, body) {
        expect(body).to.equal('42');
        done();
      });
    });

    it('accepts math expressions returning the result', function(done) {
      var options = {
        headers: {
          'x-swaggins-tag': 'answer',
          'x-swaggins-endpoint-description': 'Evaluate your math expressions'
        },
        uri: 'http://localhost:1337/answer/math',
        method: 'POST',
        json: {
          expressions: [
            '1 + 1 + 1',
            '41 + 1'
          ]
        }
      };
      request(options, function(err, res, body) {
        expect(body).to.deep.equal([ 3, 42 ]);
        done();
      });
    });

  });

  describe('db', function() {

    it('adds an item', function(done) {
      var options = {
        headers: {
          'x-swaggins-tag': 'db',
          'x-swaggins-path': '/db/{id}',
          'x-swaggins-endpoint-description': 'Add an item to the database'
        },
        uri: 'http://localhost:1337/db',
        method: 'POST',
        json: { item: { key: 1, value: 2 } }
      };
      request(options, function(err, res, body) {
        expect(res.statusCode).to.equal(201);
        expect(body).to.deep.equal({ newitem: { key: 1, value: 2 }});
        done();
      });
    });

    it('gets an item', function(done) {
      var options = {
        headers: {
          'x-swaggins-tag': 'db',
          'x-swaggins-path': '/db/{id}',
          'x-swaggins-endpoint-description': 'Get an item from the database'
        },
        uri: 'http://localhost:1337/db/1'
      };
      request(options, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(body)).to.deep.equal({
          item: { key: 1, value: 2 }
        });
        done();
      });
    });

    it('updates an item', function(done) {
      var options = {
        headers: {
          'x-swaggins-tag': 'db',
          'x-swaggins-path': '/db/{id}',
          'x-swaggins-endpoint-description': 'Update an item in the database'
        },
        uri: 'http://localhost:1337/db/1',
        method: 'PUT',
        json: { newvalue: 3 }
      };
      request(options, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body).to.deep.equal({ item: { key: 1, value: 3 }});
        done();
      });
    });

    it('deletes an item', function(done) {
      var options = {
        headers: {
          'x-swaggins-tag': 'db',
          'x-swaggins-path': '/db/{id}',
          'x-swaggins-endpoint-description': 'Delete an item from the database'
        },
        uri: 'http://localhost:1337/db/1',
        method: 'DELETE'
      };
      request.del(options, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('gets all db', function(done) {
      var options = {
        headers: {
          'x-swaggins-tag': 'db',
          'x-swaggins-path': '/db',
          'x-swaggins-endpoint-description': 'Return the whole database'
        },
        uri: 'http://localhost:1337/db'
      };
      request(options, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(body)).to.deep.equal({ items: {}});
        done();
      });
    });

  });

});
