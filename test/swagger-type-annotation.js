describe('swagger-type-annotation', function() {

  var lib = require('../lib/swagger-type-annotation'),
      expect = require('chai').expect;

  describe('primitive', function() {

    it('exists', function() {
      expect(lib.primitive).to.exist;
    });

    it('handles string', function() {
      var result = lib.primitive('world'),
          expected = {
            type: 'string',
            example: 'world'
          };

      expect(result).to.deep.equal(expected);
    });

    it('handles number', function() {
      var result = lib.primitive(42),
          expected = {
            type: 'number',
            example: 42
          };

      expect(result).to.deep.equal(expected);
    });

  });

  describe('isPrimitive', function() {

    it('exists', function() {
      expect(lib.isPrimitive).to.exist;
    });

    it('identifies wether parameter is a primitive', function() {
      expect(lib.isPrimitive(0)).to.be.true;
      expect(lib.isPrimitive(42)).to.be.true;
      expect(lib.isPrimitive('lazywithclass')).to.be.true;
      expect(lib.isPrimitive({})).to.be.false;
      expect(lib.isPrimitive([])).to.be.false;
    });

  });

  describe('array', function() {

    it('exists', function() {
      expect(lib.array).to.exist;
    });

    it('handles array of strings', function() {
      var result = lib.array(['parzival', 'art3mis']),
          expected = {
            type: 'array',
            items: {
              type: 'string',
              example: 'parzival'
            }
          };

      expect(result).to.deep.equal(expected);
    });

    it('handles array of numbers', function() {
      var result = lib.array([1, 2]),
          expected = {
            type: 'array',
            items: {
              type: 'number',
              example: 1
            }
          };

      expect(result).to.deep.equal(expected);
    });

    it('handles array of objects', function() {
      var input = [{ rank: 1, nickname: 'parzival' }];
      var result = lib.array(input),
          expected = {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                rank: {
                  type: 'number',
                  example: 1
                },
                nickname: {
                  type: 'string',
                  example: 'parzival'
                }
              }
            }
          };

      expect(result).to.deep.equal(expected);
    });

  });

  describe('object', function() {

    it('exists', function() {
      expect(lib.object).to.exist;
    });

    it('handles simple object', function() {
      var result = lib.object({ title: 'ready player one' }),
          expected = {
            title: {
              type: 'string',
              example: 'ready player one'
            }
          };
      expect(result.properties).to.deep.equal(expected);
    });

    it('handles 1 level nested object', function() {
      var input = { rank: 1, player: { nickname: 'parzival' } };
      var result = lib.object(input),
          expected = {
            rank: {
              type: 'number',
              example: 1
            },
            player: {
              type: 'object',
              properties: {
                nickname: {
                  type: 'string',
                  example: 'parzival'
                }
              }
            }
          };

      expect(result.properties).to.deep.equal(expected);
    });

    it('handles array', function() {
      var input = {
        document: {
          data: [{
            answer: 42
          }],
          name: 'question'
        }
      };
      var result = lib.object(input),
          expected = {
            document: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'question'
                },
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      answer: {
                        type: 'number',
                        example: 42
                      }
                    }
                  }
                }
              }
            }
          };

      expect(result.properties).to.deep.equal(expected);
    });

  });

});
