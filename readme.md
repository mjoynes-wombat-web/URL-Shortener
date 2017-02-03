# URL Shortener - Version 1
This URL shortener creates a unique shortened URL based on an ID that will be provided by auto incremented IDs form the database in the next version.

## Installation
Use [`npm install`] in the main directory to install the project and it's dependancies.

### API Access

### Creating a short URL.
#### [`POST http://localhost:3000/api/v1/urls`]

#### Summary
By passing a URL to this address you will create a shortened URL. 

#### Parameters
  Name  |  Located In  |  Description
--------|--------------|-------------
   url  |     body     |  Pass in a url to be shortened.

### Accessing All URLs.
#### [`GET http://localhost:3000/api/v1/urls`]

#### Summary
Accessing this endpoint will return all of the shortened urls.

### Accessing URL by ID.
######## [`GET http://localhost:3000/api/v1/urls/:id`]

#### Summary
By replacing [`:id`] in the GET url you can retrieve an url by it's ID.