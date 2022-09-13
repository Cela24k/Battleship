first of all we need to create a .env file into /RocketDuoGroup path and add into it those variables:
DB_URI = <mongouri>
JWT_SECRET = <jwtsecret>

Then for installing all the dependecies run "npm install" in the /RocketDuoGroup and /RocketDuoGroup/client paths.
After installed all the dependecies run in /RocketDuoGroup "npm run compile" for compile the typescript and then "npm run start" for starting the server.
In conclusion for the client run in /RocketDuoGroup/client ng serve.
