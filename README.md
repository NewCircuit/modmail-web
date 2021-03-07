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

## Important Notes
Currently there are two required dependencies that not hosted within npm. In order to be
able to retrieve these dependencies, we use a file called `.npmrc`. By default, as soon as
you run `npm install` or `yarn install`, a `.npmrc` file should be generated that is a direct
copy of [.npmrc.default](./.npmrc.default). If for some reason this does not happen, or you 
receive `Not Found` or `403 Forbidden`, all you should have to do is delete the original `.npmrc`
within this directory that _**should**_ be there, and either manually copy/paste the `.npmrc.default` 
or run `yarn install` again.

#### These are required to be present in `.npmrc`
```npm
@NewCircuit:registry=https://npm.pkg.github.com
@demitchell14:registry=https://npm.pkg.github.com
```
___

### Important Scripts
#### This can be run with either `yarn` or `npm`. The choice is yours.
|Command|Purpose|
|---|---|
|`yarn start`|Start a development instance of the web app on the local machine|
|`yarn run serve`|Starts a local HTTP server that serves the `build` directory|
|`yarn run build`|Builds an optimized and bundled version of the web app|
|`yarn run lint`|Runs ESLint on entire project|
|`yarn run prettier`|Executes Prettier on all `.tsx?` files in `src`|
|`yarn run profile`|Generates a visual diagram of what is inside a production build|


[chat-image]: https://img.shields.io/discord/718433475828645928
[lines-image]: https://img.shields.io/tokei/lines/github/NewCircuit/modmail-web
[version-image]: https://img.shields.io/github/package-json/v/NewCircuit/modmail-web
[modmail-web]: https://github.com/NewCircuit/modmail-web
[icon]: ./public/icon/96.png
