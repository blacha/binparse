# [2.1.0](https://github.com/blacha/binparse/compare/v2.0.1...v2.1.0) (2022-05-09)

### Bug Fixes

- correctly get the size whe using the `at` type ([ed1d18a](https://github.com/blacha/binparse/commit/ed1d18a2a793c12022cd19a9f50c28c715c57dfd))
- start at the offset that was passed in not at zero ([5980e64](https://github.com/blacha/binparse/commit/5980e64bcae2061eccc9686a135329eb080069b0))

### Features

- add explicit reading option to read at locations ([7dfc70a](https://github.com/blacha/binparse/commit/7dfc70a99394b2b26bf7fcabff3baa73ddc8c7bf))
- force set the size of objects ([cba7c33](https://github.com/blacha/binparse/commit/cba7c330bf952b72749f715eb99118f429161e99))

## [2.0.1](https://github.com/blacha/binparse/compare/v2.0.0...v2.0.1) (2021-10-27)

### Bug Fixes

- make both object implementations the same ([631de17](https://github.com/blacha/binparse/commit/631de17fb905301090b4e8381975080ae6cc7f74))
- use "use strict"; to prevent function leakage ([152543b](https://github.com/blacha/binparse/commit/152543b6b5b48b7d512bc04f95d3d3ca744b85e0))

### Features

- make the two object generators more similar ([3a7bfab](https://github.com/blacha/binparse/commit/3a7bfabda814271ba3bae7379477e469468a6245))

### Performance Improvements

- rename all benchmarks to reset their stats ([7c9e590](https://github.com/blacha/binparse/commit/7c9e590a4246f3b19d9d0c741f20e5008e658993))

# [2.0.0](https://github.com/blacha/binparse/compare/v1.3.1...v2.0.0) (2021-10-25)

### Features

- greatly increase the number of points required for the array benchmark ([bfee799](https://github.com/blacha/binparse/commit/bfee799f0f5be51f029fcfdf4923ad68c922abeb))
- remove variable object type lookups can now be done on the parent object ([4147f41](https://github.com/blacha/binparse/commit/4147f41c8821638383d5de334f5e148ab74d8dc4))
- support weird key names in object functions eg `"` ([fa695a5](https://github.com/blacha/binparse/commit/fa695a58eeb948df8cb9bbf06ed397abbc87089b))

## [1.3.1](https://github.com/blacha/binparse/compare/v1.3.0...v1.3.1) (2021-10-25)

### Features

- include the field names in the object ([304d933](https://github.com/blacha/binparse/commit/304d93306badac0a38e0bfba19742b6574c4fbc0))

# [1.3.0](https://github.com/blacha/binparse/compare/v1.2.1...v1.3.0) (2021-10-25)

### Features

- benchmark on every push to master ([4b40a79](https://github.com/blacha/binparse/commit/4b40a79226e05cdc7eeb7d7ceb8be639037f7e70))
- generate a function for improved performance ([30d4cd7](https://github.com/blacha/binparse/commit/30d4cd7a5ea184507f3c32b044292a563bd1cb8c))
- improve continous benchmarks ([f2267c0](https://github.com/blacha/binparse/commit/f2267c0aa8b80d8003e17dd4494abefd85e0a6c1))
- only add keys to objects if they exist ([60f47ca](https://github.com/blacha/binparse/commit/60f47ca691cfa6cec70cf1256144fbe32a1f50e3))
- track performance of int ([eafa59c](https://github.com/blacha/binparse/commit/eafa59cb88a9b937be662fd0d97699a0fcaa7180))

### Performance Improvements

- minor adjustments to how ints and objects are read ([f1dc88e](https://github.com/blacha/binparse/commit/f1dc88ef547f761d229dd29b2f5943b59a7893c5))

## [1.2.1](https://github.com/blacha/binparse/compare/v1.2.0...v1.2.1) (2021-08-29)

### Bug Fixes

- export Object strut type ([4f7c7cf](https://github.com/blacha/binparse/commit/4f7c7cf8005eed8f1c8227651d0a3327cb33e604))

# [1.2.0](https://github.com/blacha/binparse/compare/v1.1.0...v1.2.0) (2021-08-28)

### Features

- add .size to calculate the size of a strut ([#171](https://github.com/blacha/binparse/issues/171)) ([a4d1ab8](https://github.com/blacha/binparse/commit/a4d1ab8e50c4c22f63b0b65ada6635324c58692a))
- add support for a number and BigInt based lu64 ([#172](https://github.com/blacha/binparse/issues/172)) ([e3b9527](https://github.com/blacha/binparse/commit/e3b952752a1d99aab26ea269551fa6cd91a5f1e6))

# [1.1.0](https://github.com/blacha/binparse/compare/v1.0.1...v1.1.0) (2021-02-23)

### Features

- adding refine to standard base ([4e234d3](https://github.com/blacha/binparse/commit/4e234d3bc7557178fa213a191a3094ae4d0ea392))

## [1.0.1](https://github.com/blacha/binparse/compare/v1.0.0...v1.0.1) (2020-09-16)

### Bug Fixes

- **uint32:** uint32 is now actually a uint ([de97952](https://github.com/blacha/binparse/commit/de979521a8549b782b604b73aed33998ea98967b))

# [1.0.0](https://github.com/blacha/binparse/compare/v0.3.0...v1.0.0) (2020-09-15)

### Features

- reduce interface for input ([003ca23](https://github.com/blacha/binparse/commit/003ca235f60328453dccf0e9d7b744bbb46e5068))

### BREAKING CHANGES

- no longer use Buffer | number[] as the typeing for it is too broad, use a very minimal type interface

# [0.3.0](https://github.com/blacha/binparse/compare/v0.2.0...v0.3.0) (2020-09-01)

### Features

- adding .bool() ([e7c904a](https://github.com/blacha/binparse/commit/e7c904a9ace88a5c9596ebdba4a97850b93171df))

# [0.2.0](https://github.com/blacha/binparse/compare/v0.1.0...v0.2.0) (2020-08-29)

### Features

- improve typing of bp.lookup and bp.enum ([6a964de](https://github.com/blacha/binparse/commit/6a964de518282933f61de1f24d524c3d27d20f68))
- **bitstream:** bitstream string reader ([3b6b13f](https://github.com/blacha/binparse/commit/3b6b13f132b751436ef39a37a9deb4cc75347d22))

# 0.1.0 (2020-08-29)

### Features

- adding bit flag strut type ([78cfdd5](https://github.com/blacha/binparse/commit/78cfdd57faebec48de4ea1550c322c716c221cdd))
- initial commit ([275afb4](https://github.com/blacha/binparse/commit/275afb4f2abc34953f3fb768738583e32f0fa1b8))
