const expect = require('expect.js');
const embedcode = require('../dist/tout-js-sdk-embed-code.min.js');

describe('embedcode', () => {
  it('should exist', () => {
    expect(embedcode).to.be.an('object');
  });
});
