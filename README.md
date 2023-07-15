<div style="display:flex; align-items:center; justify-content:center">
  <img alt="logo" src="./assets/banner-with-border.svg" width="100%" />
</div>

<br />

<a href="https://codeclimate.com/github/onebeyond/license-checker/maintainability"><img src="https://api.codeclimate.com/v1/badges/b82d888950f7f1b3f6a7/maintainability" /></a>
<a href="https://codeclimate.com/github/onebeyond/license-checker/test_coverage"><img src="https://api.codeclimate.com/v1/badges/b82d888950f7f1b3f6a7/test_coverage" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

🕵️ Audit your NPM dependencies and reject any forbidden license.

Check our [wiki](https://github.com/onebeyond/license-checker/wiki)!

## 📝 Description

This package allows you to do a quick audit on your NPM dependencies by adding it in your hooks.

You can optionally add options to exclude generating the report or avoid generating the error report in case a forbidden license is found (see more details [here](#options)).

## 🔎 How to use it in your project

- Install the package

```sh
npm install @onebeyond/license-checker
```

- Add a script to run the package

```sh
npx @onebeyond/license-checker --failOn license
```
- If you are using **yarn** you may want to run it from the node modules instead of using npx

```sh
node_modules/.bin/license-checker --failOn license
```

- Use the script wherever you want (husky hook, in your CI/CD pipeline, ...)

## 🚩 <a name="options"></a>Options

| Option | Description | Type | Default |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------------------------|
| --start               | Path of the initial json to look for                                                                                                                         | string   | `process.cwd()`                 |
| --version             | Shows the version of the package                                                                                                                             | string   |                                 |
| --failOn              | Fail (exit with code 1) if any package license does not satisfies any license in the provided list                                                           | string[] |                                 |
| --outputFileName      | Name of the output file generated                                                                                                                            | string   | `license-report-<timestamp>.md` |
| --errorReportFileName | Name of the file generated when a license in the failOn option is found                                                                                      | string   | `license-error-<timestamp>.md`  |
| --disableErrorReport  | Flag to disable the error report file generation                                                                                                             | boolean  | `false`                         |
| --disableReport       | Flag to disable the report file generation, whether there is an error or not                                                                                 | boolean  | `false`                         |
| --customHeader        | Name of a text file containing the custom header to add at the start of the generated report                                                                 | string   |                                 |
| --checkLicense        | License to be check against SPDX. It is intended to be used as a standalone option, i.e. if it is present, it will not trigger the package licenses scanning | string   |                                 |
| -h, --help            | Shows help                                                                                                                                                   | boolean  |                                 |

## 🧑‍💻 <a name="examples"></a>Examples

### checkLicense

This option is intended to be used as a standalone functionality to check whether the value supplied is in compliance with SDPX, 
meaning that if present, the scanning process will not be triggered. It is useful for checking the value before using it on the `failOn` option:

```sh
npx @onebeyond/license-checker --checkLicense "(MIT OR GPL-1.0+) AND 0BSD"
```

If the value provided is not SPDX compliant, the process fails (exit error 1).

### failOn

All the values provided in the list must be [SPDX](https://spdx.dev/specifications/) compliant. Otherwise, an error will be thrown (exit error 1). 
Check the [SPDX license list](https://spdx.org/licenses/)

```sh
npx @onebeyond/license-checker --failOn MIT GPL-1.0+
```

The input list is transformed into a SPDX expression with the `OR` logical operator. In the example, that is `MIT OR GPL-1.0+`.
If any of the packages' licenses satisfies that expression, the process fails (exit error 1).

## 🔗 Useful links

- [Licensing a repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/licensing-a-repository)
- [Choose a license](https://choosealicense.com/appendix/)

## ⚠️ Temporal issue

An issue in `spdx-satisfies` has been found and it's pending resolution. Until then, GFDL 1x licenses are not supported and an error will be thrown if either packages or failOn arguments contain it. 

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jmtorralvo"><img src="https://avatars.githubusercontent.com/u/6839860?v=4?s=100" width="100px;" alt="Jose Manuel Torralvo Moyano"/><br /><sub><b>Jose Manuel Torralvo Moyano</b></sub></a><br /><a href="https://github.com/onebeyond/license-checker/commits?author=jmtorralvo" title="Code">💻</a> <a href="https://github.com/onebeyond/license-checker/commits?author=jmtorralvo" title="Documentation">📖</a> <a href="#ideas-jmtorralvo" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-jmtorralvo" title="Maintenance">🚧</a> <a href="https://github.com/onebeyond/license-checker/pulls?q=is%3Apr+reviewed-by%3Ajmtorralvo" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/MarioQuiroga32"><img src="https://avatars.githubusercontent.com/u/43605474?v=4?s=100" width="100px;" alt="Mario Quiroga"/><br /><sub><b>Mario Quiroga</b></sub></a><br /><a href="https://github.com/onebeyond/license-checker/commits?author=MarioQuiroga32" title="Code">💻</a> <a href="https://github.com/onebeyond/license-checker/commits?author=MarioQuiroga32" title="Documentation">📖</a> <a href="#ideas-MarioQuiroga32" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-MarioQuiroga32" title="Maintenance">🚧</a> <a href="https://github.com/onebeyond/license-checker/pulls?q=is%3Apr+reviewed-by%3AMarioQuiroga32" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/inigomarquinez"><img src="https://avatars.githubusercontent.com/u/25435858?v=4?s=100" width="100px;" alt="Íñigo Marquínez"/><br /><sub><b>Íñigo Marquínez</b></sub></a><br /><a href="https://github.com/onebeyond/license-checker/commits?author=inigomarquinez" title="Code">💻</a> <a href="https://github.com/onebeyond/license-checker/commits?author=inigomarquinez" title="Documentation">📖</a> <a href="#ideas-inigomarquinez" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-inigomarquinez" title="Maintenance">🚧</a> <a href="https://github.com/onebeyond/license-checker/pulls?q=is%3Apr+reviewed-by%3Ainigomarquinez" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/LonelyPrincess"><img src="https://avatars.githubusercontent.com/u/17673317?v=4?s=100" width="100px;" alt="Sara Hernández"/><br /><sub><b>Sara Hernández</b></sub></a><br /><a href="https://github.com/onebeyond/license-checker/commits?author=LonelyPrincess" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dustytrinkets"><img src="https://avatars.githubusercontent.com/u/18383417?v=4?s=100" width="100px;" alt="Laura"/><br /><sub><b>Laura</b></sub></a><br /><a href="https://github.com/onebeyond/license-checker/pulls?q=is%3Apr+reviewed-by%3Adustytrinkets" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ardguezsoc"><img src="https://avatars.githubusercontent.com/u/79102959?v=4?s=100" width="100px;" alt="Adri Rodríguez "/><br /><sub><b>Adri Rodríguez </b></sub></a><br /><a href="https://github.com/onebeyond/license-checker/pulls?q=is%3Apr+reviewed-by%3Aardguezsoc" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/neodmy"><img src="https://avatars.githubusercontent.com/u/36865163?v=4?s=100" width="100px;" alt="David Miguel Yusta"/><br /><sub><b>David Miguel Yusta</b></sub></a><br /><a href="https://github.com/onebeyond/license-checker/commits?author=neodmy" title="Code">💻</a> <a href="https://github.com/onebeyond/license-checker/commits?author=neodmy" title="Documentation">📖</a> <a href="#ideas-neodmy" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-neodmy" title="Maintenance">🚧</a> <a href="https://github.com/onebeyond/license-checker/pulls?q=is%3Apr+reviewed-by%3Aneodmy" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/onebeyond/license-checker/commits?author=neodmy" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/lcruz45"><img src="https://avatars.githubusercontent.com/u/91122266?v=4?s=100" width="100px;" alt="Lucía"/><br /><sub><b>Lucía</b></sub></a><br /><a href="#design-lcruz45" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://ulisesgascon.com/"><img src="https://avatars.githubusercontent.com/u/5110813?v=4?s=100" width="100px;" alt="Ulises Gascón"/><br /><sub><b>Ulises Gascón</b></sub></a><br /><a href="https://github.com/onebeyond/license-checker/commits?author=UlisesGascon" title="Code">💻</a> <a href="https://github.com/onebeyond/license-checker/commits?author=UlisesGascon" title="Documentation">📖</a> <a href="#maintenance-UlisesGascon" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.one-beyond.com/"><img src="https://avatars.githubusercontent.com/u/50929081?v=4?s=100" width="100px;" alt="Fernando de la Torre"/><br /><sub><b>Fernando de la Torre</b></sub></a><br /><a href="https://github.com/onebeyond/license-checker/commits?author=nanotower" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
