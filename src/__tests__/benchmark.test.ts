// import { bp } from '../index';
// import o from 'ospec';
// import { StrutTypeArrayOffsetLength } from '../object';

// o.spec('Benchmark', () => {
//   const object = bp.object('PointArray', {
//     offset: new StrutTypeArrayOffsetLength(bp.lu32),
//     data: bp.arrayWithOffset('Points', bp.object('Point', { x: bp.lu16, y: bp.lu16 }), false),
//   });

//   let FakeData: number[] = [];

//   const ObjectCount = 2 ** 16;
//   o.before(() => {
//     // const buf = Buffer.alloc(4 + ObjectCount * 4);
//     const view = new DataView([] as any);
//     let offset = 0;
//     view.setUint32(offset, ObjectCount, true);
//     offset += 4;
//     for (let i = 0; i < ObjectCount; i++) {
//       view.setUint16(offset, offset, true);
//       view.setUint16(offset + 2, offset + 2, true);
//       offset += 4;
//     }
//     FakeData = buf.toJSON().data;
//   });

//   o('should parse things pretty quickly', () => {
//     for (let i = 0; i < 10; i++) {
//       console.time('Parse');
//       object.create(FakeData);
//       console.timeEnd('Parse');
//     }
//   });
// });
