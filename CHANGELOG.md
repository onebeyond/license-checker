# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/guidesmiths/license-checker/compare/v1.2.0...v1.2.1) (2022-02-08)


### Bug Fixes

* mooved checkIfLicensesAreCorrect inside init callback ([#39](https://github.com/guidesmiths/license-checker/issues/39)) ([f78e71b](https://github.com/guidesmiths/license-checker/commit/f78e71b5f59c37a58e738c70fdbdb334d65858a5))

## [1.2.0](https://github.com/guidesmiths/license-checker/compare/v1.1.1...v1.2.0) (2021-11-05)


### Bug Fixes

* checkIfLicenseAreCorrect description ([3e64350](https://github.com/guidesmiths/license-checker/commit/3e6435081a76295225bff0ecc1a9a0c132916637))
* license validation ([35b59f1](https://github.com/guidesmiths/license-checker/commit/35b59f1735aa8a98f031aba3fc78d38fa73a71da))
* linter errors ([ff76675](https://github.com/guidesmiths/license-checker/commit/ff766751844b0aa61e2bbe55f06a3d8bcf7d42b3))
* removed console.log ([8c6de5e](https://github.com/guidesmiths/license-checker/commit/8c6de5e9b0d197fdb2942fca26c922ee985e85b9))
* return also users licenses even if not in licenses array ([5d55997](https://github.com/guidesmiths/license-checker/commit/5d55997bde7cb6c9070ceee7c9f04d0e34c7bd98))

### [1.1.1](https://github.com/guidesmiths/license-checker/compare/v1.1.0...v1.1.1) (2021-11-04)


### Bug Fixes

* added is-ci to avoid running husky in ci ([300ff3e](https://github.com/guidesmiths/license-checker/commit/300ff3ef9efb522ebc250fd1fc93dc700888643a))
* dependecies fixed versions ([9be5136](https://github.com/guidesmiths/license-checker/commit/9be51365c299494e6cc72fc1b71fc9e6b4972de9))

## [1.1.0](https://github.com/guidesmiths/license-checker/compare/v1.0.0...v1.1.0) (2021-11-03)


### Features

* add custom header at the start of report ([b27c27b](https://github.com/guidesmiths/license-checker/commit/b27c27be392a02b676575a08e0a597c0f545ae20))
* add header to auto generated license file ([6d02348](https://github.com/guidesmiths/license-checker/commit/6d02348b7b26e7891418e5e28103454c73b884e8))
* add new 'disableReport' option to args ([ca4257d](https://github.com/guidesmiths/license-checker/commit/ca4257dc31efe4f733667d0c42f51c406bc89da1))
* added PR, bug and feature request templates ([a8afc42](https://github.com/guidesmiths/license-checker/commit/a8afc4240bd951e5c967c6555ed429bfb853f4eb))
* create md file with table format for license report ([a798550](https://github.com/guidesmiths/license-checker/commit/a798550aea746083d2cf1c0a6d87074192e71746))
* define new option to set up a custom header ([dd02054](https://github.com/guidesmiths/license-checker/commit/dd02054817d46c040c06447463271ca6d6d38f25))
* don't generate report if 'disableReport' is enabled ([13e92ef](https://github.com/guidesmiths/license-checker/commit/13e92ef4354f4ae2063aee29af77e036078fe372))
* eslint ([b88e671](https://github.com/guidesmiths/license-checker/commit/b88e671f7b41cf709be81b73fb567c46496015ad))
* show package count for each invalid license ([e5a9f63](https://github.com/guidesmiths/license-checker/commit/e5a9f63fd428a5dea7de1bd68c66ccf409ceb927))


### Bug Fixes

* added new option start with default value to process.cwd() ([e888c40](https://github.com/guidesmiths/license-checker/commit/e888c404b205d4293b26f6cef5a7ef3ceffcffb3))
* CI release script ([ac83990](https://github.com/guidesmiths/license-checker/commit/ac83990e6bec0b57d7cc6c8c2bafff54cac08cdb))
* do not use colon in default filename for windows ([c19154b](https://github.com/guidesmiths/license-checker/commit/c19154b640ab06838d06a45f22e979ab93eb5c24))
* fix package name for separate version and scope (@) ([3f4cdd0](https://github.com/guidesmiths/license-checker/commit/3f4cdd023f3f35c0be585c249560811beb9ce1fb))
* github action ([927ec09](https://github.com/guidesmiths/license-checker/commit/927ec09b22052103bc05e4ee5d46bfe3398fa1a8))
* github action to publish to npm ([b21968e](https://github.com/guidesmiths/license-checker/commit/b21968e691cf2e1d823ab06eecc04512e3568927))
* github action to publish to npm ([9289bd0](https://github.com/guidesmiths/license-checker/commit/9289bd0173cbb6ce9df64ae8e0af7bfb050974f8))
* github action to publish to npm ([4590bbc](https://github.com/guidesmiths/license-checker/commit/4590bbc5178ccbcff9687ffffb7f00ebdc457d06))
* github action to publish to npm ([421e4da](https://github.com/guidesmiths/license-checker/commit/421e4daf3cc9964f49ab451931e1d3da80a58fc8))
* github action to publish to npm ([0352cde](https://github.com/guidesmiths/license-checker/commit/0352cde99d519fe40c98962bff3d7b42206b92af))
* github action to publish to npm ([b5833ac](https://github.com/guidesmiths/license-checker/commit/b5833ac0954e44124d7da2c367ff852a307010fc))
* github action to publish to npm ([904ce4b](https://github.com/guidesmiths/license-checker/commit/904ce4b616fa76e9880c43ea9cb4f23538d1e9cc))
* husky lint ([5c6c1b8](https://github.com/guidesmiths/license-checker/commit/5c6c1b8b61de205c90436f032ff48adbd7466e64))
* run with npx ([ee0eb2b](https://github.com/guidesmiths/license-checker/commit/ee0eb2b47f3ff0a341fa5ac8c0b35199d4160e23))
* update readme ([c9c9f3c](https://github.com/guidesmiths/license-checker/commit/c9c9f3c6768544f0e4e310b7ac1cde29e4bdee15))
