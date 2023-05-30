import { describe, it } from 'node:test';
import assert from 'node:assert';
import { bp } from '../index.js';

enum Foo {
  bar = 1,
  baz = 2,
}

describe('StrutLookup', () => {
  it('should lookup from enum', () => {
    const lookup = bp.lookup<typeof Foo>('Foo', bp.u8, (id) => {
      switch (id) {
        case 1:
          return 'bar';
        case 2:
          return 'baz';
      }
      return undefined;
    });
    assert.equal(lookup.size, 1);
    assert.equal(lookup.raw([0x01]).name, 'bar');
    assert.equal(lookup.raw([0x01]).id, 1);

    assert.equal(lookup.raw([0x02]).name, 'baz');
    assert.equal(lookup.raw([0x02]).id, 2);
  });

  it('should be typesafe in lookups', () => {
    const lookup = bp.enum('Foo', bp.u8, Foo);
    assert.equal(lookup.size, 1);
    assert.equal(lookup.raw([0x01]).name, 'bar');
    assert.equal(lookup.raw([0x01]).id, 1);

    assert.equal(lookup.raw([0x02]).name, 'baz');
    assert.equal(lookup.raw([0x02]).id, 2);
  });
});
