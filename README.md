     _____  __  __  _____
    |  __ \|  \/  |/ ____|
    | |__) | \  / | (___
    |  ___/| |\/| |\___ \
    | |    | |  | |____) |
    |_|    |_|  |_|_____/

Secure password server

## Installation

```
git clone
npm install
npm install -g sequelize

createdb pms_development
sequelize -m              # run migrations

createdb pms_test
sequelize -m -e test
```

## Development

So far you can run some tests.

`npm test`

Or, install mocha globally (recommended)

```
npm install -g mocha
mocha
```

