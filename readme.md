# URL Shortener - Version 1.1.0
This URL shortener creates a unique shortened URL based on a randomly generated string from Math.random();
<br>
<br>
# Installation
Use `npm install` in the main directory to install the project and its dependencies.
<br>
<br>
# GO Route
## Accessing a shortened URL.
#### [`http://localhost:3000/go/:shortenedURL]

### Summary
By `:shortenedURL` with one of the shortened URLs you will be redirected to the full URL that's stored in the database.
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
By replacing `:id` in the POST URL you can update the URL.

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
By replacing `:id` in the DELETE URL you can update the URL.

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