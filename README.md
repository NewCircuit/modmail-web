# Modmail Web App

[![Version][version-image]](/) [![Lines][lines-image]](/)

![Logo](./public/icon/96.png)

___

*This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).*

##### Command used to generate template
#### `yarn create react-app modmail-web-ui --template typescript-eslint-prettier`


#### [Modmail](https://github.com/NewCircuit/modmail)
#### [Used endpoints provided by the Modmail Server](./resources/Endpoints.md)

___

### Important Scripts
#### This can be run with either `yarn` or `npm`. The choice is yours, however, this was developed using `yarn`.
|Command|Purpose|
|---|---|
|`yarn start`|Start a development instance of the web app on the local machine|
|`yarn run serve`|Starts a local HTTP server that serves the `build` directory|
|`yarn run build`|Builds an optimized and bundled version of the web app|
|`yarn run lint`|Runs ESLint on entire project|
|`yarn run prettier`|Executes Prettier on all `.tsx?` files in `src`|
|`yarn run profile`|Generates a visual diagram of what is inside a production build|

___

This project uses `i18next`. Almost all static text within the app is editable within a single JSON file. Because of this,
you actually do not have to rebuild your project if all you did, for example was change the name of the app.

This also means that the app can be easily translated to other languages. `modmail-web` currently has an english version,
however, if you are a translator and would like to translate this app, you can use the english translation file as a template.

The English i18n file: [./public/i18n/en/translation.json](./public/i18n/en/translation.json)


[chat-image]: https://img.shields.io/discord/718433475828645928
[lines-image]: https://img.shields.io/tokei/lines/github/NewCircuit/modmail-web
[version-image]: https://img.shields.io/github/package-json/v/NewCircuit/modmail-web
[modmail-web]: https://github.com/NewCircuit/modmail-web
[icon]: ./public/icon/96.png
