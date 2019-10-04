# hours-configuration-js

Shared JS library for Cliengo hours configuration.

## Installation

```bash
npm install https://github.com/Cliengo/hours-configuration-js#semver:~1.1.2
```

## Usage

```javascript
const HoursConfig = require('@cliengo/hours-configuration')

if (HoursConfig.isWebsiteClosedNow(businessHoursConfig, 'CHATBOT')) {
  // Do stuff
} else {
  // Don't
}
```

## Contributing

1. Check out repo and create a branch
1. Do your thing
1. Bump version **following [SemVer](https://semver.org/)**
1. Transpile code with `npm run build`
1. Create a tag with the same name as the new version, **otherwise the new version won't be downloadable!** `git tag X.Y.Z`
1. Submit a PR

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
