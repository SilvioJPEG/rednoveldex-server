# vnoveldex
Vnoveldex is letterboxd-like network for visual novel readers. 
It bases on vndb which is the biggest visual novel database to check for novels and retrive basic info about them.

Backend is build with:
- Nest.js 
- passport-jwt
- sequelize 
- multer
- vndb-api

Vnoveldex uses Postgres as a database and sequelize as an ORM. 
database ER-diagram:
![ER-model](https://github.com/SilvioJPEG/vnoveldex-backend/blob/main/vnoveldex_db.png?raw=true)


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

