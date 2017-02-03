# URL Shortener - Version 1
This URL shortener creates a unique shortened URL based on a randomly generated string from Math.random();

The version 0.9 API uses a URL based on the URL ID which should be provided by the database's auto-incrementing ID in the future version of that branch. This ensures absolutely unique URLs as the database should never create unique IDs.

<br>
<br>
# Installation
Use `npm install` in the main directory to install the project and its dependencies.
<br>
<br>
# API Access

## Creating a short URL.
#### [`POST http://localhost:3000/api/v1/urls`]

### Summary
By passing a URL to this address you will create a shortened URL.

### Parameters
  Name  |  Located In  |  Description
--------|--------------|-------------
   url  |     body     |  Pass in a URL to be shortened.

### Sample Response
```
{
  "status": {
    "code": 201
  },
  "urls": {
    "urlId": 5,
    "origURL": "http://www.google.com/testing",
    "shortURL": "/wu4vlflt3"
  }
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
      "urlId": 1,
      "origURL": "https://www.amazon.com/dp/B00X4WHP5E/ref=ods_gw_ha_d_blackandwhite?pf_rd_r=QREX1YK8J8EMC8C05PYZ&pf_rd_p=da93a4f0-0b0d-45e0-bc19-b68113bc6936",
      "shortURL": "/ftx"
    },
    {
      "urlId": 2,
      "origURL": "https://play.google.com/music/m/T4ztvelxav2rehzomrwhpdpkxcu?t=Tones_Of_Home_-_Blind_Melon",
      "shortURL": "/6g"
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
  "urls": {
    "urlId": 1,
    "origURL": "https://www.amazon.com/dp/B00X4WHP5E/ref=ods_gw_ha_d_blackandwhite?pf_rd_r=QREX1YK8J8EMC8C05PYZ&pf_rd_p=da93a4f0-0b0d-45e0-bc19-b68113bc6936",
    "shortURL": "/ftx"
  }
}
```