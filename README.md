                        ,;:;;,
                       ;;;;;
               .=',    ;:;;:,
              /_', "=. ';:;:;
              @=:__,  \,;:;:'
                _(\.=  ;:;;'
               `"_(  _/="`
                `"'``

Secret Squirrel Server

## Installation

```
git clone
npm install
npm install -g sequelize
npm install -g pg
npm install -g bunyan

Copy config/config.example.json to config/config.json and add the appropriate values for your local environment.

createdb squirrel_development
sequelize -m              # run migrations

createdb squirrel_test
sequelize -m -e test
```

## Development

Run the server.

`npm start | bunyan`

Or you can run some tests.

`npm test`

Or, install mocha globally (recommended)

```
npm install -g mocha
mocha
```

