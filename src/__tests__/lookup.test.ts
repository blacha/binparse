import o from 'ospec';
import { bp } from '../index';

enum Foo {
  bar = 1,
  baz = 2,
}

o.spec('StrutLookup', () => {
  o('should lookup from enum', () => {
    const lookup = bp.lookup<typeof Foo>('Foo', bp.u8, (id) => {
      switch (id) {
        case 1:
          return 'bar';
        case 2:
          return 'baz';
      }
      return undefined;
    });
    o(lookup.size).equals(1);
    o(lookup.raw([0x01]).name).equals('bar');
    o(lookup.raw([0x01]).id).equals(1);

    o(lookup.raw([0x02]).name).equals('baz');
    o(lookup.raw([0x02]).id).equals(2);
  });

  o('should be typesafe in lookups', () => {
    const lookup = bp.enum('Foo', bp.u8, Foo);
    o(lookup.size).equals(1);
    o(lookup.raw([0x01]).name).equals('bar');
    o(lookup.raw([0x01]).id).equals(1);

    o(lookup.raw([0x02]).name).equals('baz');
    o(lookup.raw([0x02]).id).equals(2);
  });
});
