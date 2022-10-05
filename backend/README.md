# Backend

This implementation is for NodeJS based on [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) and uses [mongoose](https://mongoosejs.com/) as the ODM.

## MongoDB Setup

This implementation utilized MongoDB Atlas for cloud access to the database. 
The Mongo URL listed below in the "Before Startup" section is the connection string needed to connect to the Atlas cloud. 
Please reach out to either Trang Tran or Aaron Oviedo if there any concerns with the cloud access. 


## Project setup
```
npm install
```

### Before startup 
Setup a .env file with the following variables listed below.
The organization variable listed is what was used during the Postman endpoint testing. 
Please use it if necessary to test out endpoints.

```
MONGO_URL = mongodb+srv://Admin:CIS4339@atlascluster.nftbill.mongodb.net/GlobalPlatform

ORGANIZATION = 6335d676e3c2212588e70a32
```

### Compiles and hot-reloads for development
```
npm start
```
### API Documentation
Documentation of the API endpoints can be found at the link below.
```
https://documenter.getpostman.com/view/17726846/2s83zcU7s2
```
