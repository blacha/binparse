# binparse


Typed binary object parser

```typescript
import { bp } from 'binparse';

const simpleParser = bp.object('SimpleObject', {
  id: bp.lu16,
  x: bp.u8,
  y: bp.u8,
});

const { value, offset } = simpleParser.read([0x01, 0x00, 0x01, 0x02]);

/** byte offset of where the reader finished */
offset; // 3

/** Parsed object */
value.id; // 0x01
value.x; // 0x01;
value.y; // 0x02

value.unk1 // Typescript error 
```

Heavily inspired by [zod](https://github.com/vriad/zod)



## Arrays

Read in a variable length array of points

Load the length in as a variable which can be referenced by the array parser for the length
```typescript
import { bp } from 'binparse';

const PointParser = bp.object('Point', {
  /** X Offset */
  x: bp.lu16,
  /** Y Offset */
  y: bp.lu16,
});

const PointsParser = bp.object('SimpleObject', {
  // Number of points to read
  length: bp.variable('len', bp.u8),
  // Array of points with length "len"
  points: bp.array('Points', PointParser, 'len'),
});

const points = PointsParser.read([0x01, 0x01, 0x00, 0x02, 0x00]);
```


## BitFlags 

```typescript
import { bp } from 'binparse';

const FlagParser = bp.bits('Flags', {
  isRed: 1,
  isGreen: 1,
  isBlue: 1,
  isAlpha: 1,
});

const { value } = FlagParser.read([0b0101]);

value.isRed; // true
value.isGreen; // false
value.isBlue; // true
value.isAlpha; // false
```


## Performance

Continuos performance monitoring is done using [hyperfine](https://github.com/sharkdp/hyperfine) and [hyperfine-action](https://github.com/blacha/hyperfine-action)

Results can be found at [benchmarks.html](https://blacha.github.io/binparse/benchmarks.html)