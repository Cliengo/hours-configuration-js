# hours-configuration-js

Shared JS library for Cliengo hours configuration.

## Installation

```bash
npm install https://github.com/Cliengo/hours-configuration-js#semver:~1.0.0
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
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
