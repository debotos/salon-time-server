# salon-time-server
## Super Admin CMS & API Server live in this codebase

### Project locally setup

```
touch .env
```

Fill it with -

```
# .env

PROJECT_NAME=salon-time-server
# Set it to 'production' when deploying
NODE_ENV=development
# Set the postgres database url when deploying
POSTGRES_DATABASE_URL=
# Optional, Just for local development
PORT=5000
HOST_URL='http://localhost'

# Set it to true to create a role: 'ADMIN' account else leave blank
# Use it after hosting the app to create the first Admin account
# Without this env variable no one can create admin account
ADMIN_MODE=

# leave it blank if you don't want to use mongo DB
USE_MONGO_DB=
MONGO_DB_URI=mongodb://localhost/salon-time-server

POSTGRES_DATABASE=salon-time-server
POSTGRES_DATABASE_USER=postgres
POSTGRES_DATABASE_PASSWORD=

JWT_SECRET=mysupersecretkey
JWT_TIMEOUT=60m

# To manage media assets (https://cloudinary.com/)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> Application will check for an '**x-token**' key value pair in the HTTP header to consider as a Authenticate User.

### Heroku Deploy

1. heroku create name-of-the-app
2. heroku addons:create heroku-postgresql:hobby-dev
3. heroku config:set NPM_CONFIG_PRODUCTION=false YARN_PRODUCTION=false [To keep dev dependencies]
4. Go to the heroku dashboard settings and copy DATABASE_URL as POSTGRES_DATABASE_URL and set up other variable as above
5. git push heroku master
