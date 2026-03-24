// oxlint-disable no-unused-expressions
import type { StrutType } from '../src/index.js';
import { bp } from '../src/index.js';

const BrandId = Symbol('BrandId');

type BrandedId = number & { [BrandId]: 'BrandedId' };
const BrandedId: StrutType<BrandedId> = bp.u8 as unknown as StrutType<BrandedId>;

const simpleParser = bp.object('SimpleObject', { id: BrandedId });

const result = simpleParser.read([0x01]);

result.value.id[BrandId]; // 'BrandedId'
