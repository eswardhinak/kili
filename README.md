## tamil toucan

Project was bootstrapped using Create React App.

public/manifest-<browser-type>.json is where we make updates to the manifest file browsers use to load extensions.

The setup was based off this blog post: https://levelup.gitconnected.com/how-to-use-react-js-to-create-chrome-extension-in-5-minutes-2ddb11899815


Build environment: macOS Catalina 10.15.6

To build, follow these steps:

1. install npm. Version 6.14 will work

2. `npm install`

3. `npm run build-prod:firefox` or `npm run build-prod:chromium` depending on target browser

4. Load generated `build` directory into browser


