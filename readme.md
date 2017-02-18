# URL Shortener - Version 1.7.0
This URL shortener creates a unique shortened URL based on a randomly generated string from Math.random();
<br>
<br>
# Installation
## Node Setup
Use `npm install` in the main directory to install the project and its dependencies.

### Dependencies
```
"body-parser": "^1.15.2",
"dotenv": "^4.0.0",
"express": "^4.14.0",
"mysql": "^2.11.1",
"sequelize": "^3.24.3"
```

## Database Access Environment Variables
This application uses Sequelize for database access and dotenv for the database environment variables. The template.env file is a template for your environment variables. Enter your database access information into that file and save it as .env.

### .ENV File Example
```
DB_NAME=*Your Database Name*
DB_USER=*Your User Name*
DB_PASS=*Your Password*
DB_HOST=*Your Database Host Address*
DB_SCHEMA=*Your Database Schema Type i.e. mysql*
DB_PORT=*Your Database Port*
```
<br>
<br>

# Usage
## Starting Application
To start the application normally run `node server.js`.

##Unit Testing
To unit test the various portions of the applications your can run the following functions while in the root directory. Due to rewire overlap all tests cannot be run at once.

Command | Modules Tested
----------------|-------------------------
`mocha test/_models.js` | Tests the models functionality.
`mocha test/_routes.js` | Tests the routes functionality.

# GO Route
## Accessing a shortened URL.
#### [`http://localhost:3000/go/:shortenedURL`]

### Summary
By replacing `:shortenedURL` with one of the shortened URLs you will be redirected to the full URL that's stored in the database.
<br>
<br>
<br>
# API Access

## Creating a short URL.
#### [`POST http://localhost:3000/api/v1/urls`]

### Summary
By passing a URL to this address you will create a shortened URL. If the URL already exists it will return that URLs information.

### Parameters
  Name  |  Located In  |  Description
--------|--------------|-------------
   URL  |     body     |  Pass in a URL to be shortened.

### Sample Response
```
{
  "status": {
    "code": 201
  },
  "urls": [
    {
      "id": 59,
      "URL": "http://www.warframe.com",
      "shortURL": "l05hmgxdn",
      "createdAt": "2017-02-05T00:32:56.000Z",
      "updatedAt": "2017-02-05T00:32:56.000Z"
    }
  ]
}
```
<br>
<br>
## Accessing All URLs.
#### [`GET http://localhost:3000/api/v1/urls`]

### Summary
Accessing this endpoint will return all of the shortened URLs.

### Sample Response
```
{
  "status": {
    "code": 200
  },
  "urls": [
    {
      "id": 11,
      "URL": "http://www.google.com/",
      "shortURL": "ui05f",
      "createdAt": "2017-02-04T18:14:52.000Z",
      "updatedAt": "2017-02-04T18:14:52.000Z"
    },
    {
      "id": 12,
      "URL": "http://www.amazon.com",
      "shortURL": "idtrl21k1",
      "createdAt": "2017-02-04T18:14:58.000Z",
      "updatedAt": "2017-02-04T18:14:58.000Z"
    }
  ]
}
```
<br>
<br>
## Accessing URL by ID.
##### [`GET http://localhost:3000/api/v1/urls/:id`]

### Summary
By replacing `:id` in the GET URL you can retrieve a URL by its ID.

### Sample Response
```
{
  "status": {
    "code": 200
  },
  "urls": [
    {
      "id": 11,
      "URL": "http://www.google.com/",
      "shortURL": "ui05f",
      "createdAt": "2017-02-04T18:14:52.000Z",
      "updatedAt": "2017-02-04T18:14:52.000Z"
    }
  ]
}
```
<br>
<br>
## Updating URL by ID.
##### [`POST http://localhost:3000/api/v1/urls/:id`]

### Summary
By replacing `:id` in the POST URL you can pass a URL to this address and update the URL with that ID.

### Parameters
  Name  |  Located In  |  Description
--------|--------------|-------------
   URL  |     body     |  Pass in a URL to be shortened.

### Sample Response
```
{
  "status": {
    "code": 200
  },
  "urls": [
    {
      "id": 11,
      "URL": "https://docs.google.com/",
      "shortURL": "ui05f",
      "createdAt": "2017-02-04T18:14:52.000Z",
      "updatedAt": "2017-02-05T00:42:02.000Z"
    }
  ]
}
```
<br>
<br>
## Deleting URL by ID.
##### [`DELETE http://localhost:3000/api/v1/urls/:id`]

### Summary
By replacing `:id` in the DELETE URL you can delete the URL with that ID.

### Sample Response
```
{
  "status": {
    "code": 200
  },
  "urls": [
    {
      "id": "59",
      "deleted": true
    }
  ]
}
```
<br>
<br>

# Code Styling
## AirBnb JavaScript
This projected follows the AirBnb Javascript styling conventions. Their documentation can be found at [https://github.com/airbnb/javascript](https://github.com/airbnb/javascript "AirBnb JavaScript Style Guide").

# Deployment
## Server Setup
The server is setup with nginx, mysql, node.js and pm2.

### Nginx
Nginx is setup to reverse proxy to localhost:3000 and uses SSL certification.

### MySQL
MySQL contains a apiCRUD table to hold the API created URLs.

## Initial Sever Setup
First you will need to create a directory to hold the code.
Then run the following commands to setup the application.
`git init` - Setup the local git repo.
`git remote add origin https://github.com/ssmith-wombatweb/URL-Shortener -m master` - Sets the origin to the master repo.
`git pull origin master` - Pulls the master repo to the server.
`git branch --set-upstream-to=origin/master master` - Sets the upstream to the master so `git pull` can be run in the future.
`npm install` - Installs the project dependencies.

### Auto-deployment GIt Hook
You will need to create a Git Hook to install new dependencies and restart pm2.
`nano .git/hooks/post-merge` - Open and create the post-merge git hook.
Insert the following into the hook.
```
#!/bin/sh

modified_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

check_run() {
        echo "$modified_files" | grep --quiet "$1" && eval "$2"
}

check_run package.json "npm install"

pm2 restart url-shortener
```

### .ENV Environment Variables.
This application uses Sequelize for database access and dotenv for the database environment variables. The template.env file is a template for your environment variables. Enter your database access information into that file and save it as .env.

### .ENV File Example
```
DB_NAME=*Your Database Name*
DB_USER=*Your User Name*
DB_PASS=*Your Password*
DB_HOST=*Your Database Host Address*
DB_SCHEMA=*Your Database Schema Type i.e. mysql*
DB_PORT=*Your Database Port*
```

### Starting The Application
Enter `pm2 start <app-root> --name <app-name>` to start the application.

## Updating the project.
Simply run `git pull` in the project root to update it. It will install any new dependencies and restart the application.