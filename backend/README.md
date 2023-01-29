## Project initialization/configuration

```bash
$ npm init -y
$ npm install typescript @types/node ts-node --save-dev
$ touch tsconfig.json
```

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "rootDir": "./src",
    "moduleResolution": "node",
    "outDir": "./build",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Add to package.json:

```json
{
  "type": "module",
  "scripts": {
    "build": "tsc -p ./tsconfig.json",
    "prestart": "prettier --write src && npm run build",
    "start": "node ./build/index.js",
    "dev": "node --watch --loader ts-node/esm ./src/index.ts"
  }
}
```

```bash
$ npm install eslint eslint-config-prettier prettier --save-dev
$ npx eslint --init
```

```bash
Need to install the following packages:
@eslint/create-config@0.4.2
Ok to proceed? (y) y
√ How would you like to use ESLint? · style
√ What type of modules does your project use? · esm
√ Which framework does your project use? · none
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · browser
√ How would you like to define a style for your project? · guide
√ Which style guide do you want to follow? · standard-with-typescript
√ What format do you want your config file to be in? · JSON
Checking peerDependencies of eslint-config-standard-with-typescript@latest
The config that you've selected requires the following dependencies:

eslint-config-standard-with-typescript@latest @typescript-eslint/eslint-plugin@^5.0.0 eslint@^8.0.1 eslint-plugin-import@^2.25.2 eslint-plugin-n@^15.0.0 eslint-plugin-promise@^6.0.0 typescript@_
√ Would you like to install them now? · No / Yes
√ Which package manager do you want to use? · npm
Installing eslint-config-standard-with-typescript@latest, @typescript-eslint/eslint-plugin@^5.0.0, eslint@^8.0.1, eslint-plugin-import@^2.25.2, eslint-plugin-n@^15.0.0, eslint-plugin-promise@^6.0.0, typescript@_
```

## Prettier configuration

https://prettier.io/docs/en/options.html

```bash
$ touch .prettierrc.json
```

```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "printWidth": 180,
  "endOfLine": "lf",
  "singleAttributePerLine": false
}
```

## Eslint configuration

https://eslint.org/docs/latest/use/configure/

```bash
$ touch .eslintrc.json
```

```json
{
  "root": true,
  "env": {
    "browser": false,
    "es2021": true,
    "node": true
  },
  "extends": ["eslint-config-standard"],
  "overrides": [],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "rules": {
    "comma-dangle": [
      "error",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "never",
        "exports": "never",
        "functions": "never"
      }
    ],
    "semi": ["error", "always"]
  }
}
```

Add to package.json:

```json
{
  "scripts": {
    "format:check": "prettier --check ./src",
    "format:write": "prettier --write ./src",
    "lint:check": "eslint --ext .ts ./src/**",
    "lint:fix": "eslint --ext .ts ./src/** --fix"
  }
}
```
