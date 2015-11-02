# nofoodz
The main repository for NoFoodz.

# Standards
Html
-Template names no special characters all lowercase no spaces
-Ids lowercase use "_" to seperate words and prefix with template name
-Classes use lowercase "-" to seperate words
-Packaging should be reflective of the url path

#Services
This will be the location of the web services.

To set the meteor Mongo_Url local dev: export MONGO_URL=mongodb://localhost:27017/your_db

#DB Indexes
db.getCollection('brands').ensureIndex({'name' : 'text'});
db.getCollection('foods').ensureIndex({'name' : 'text'});
db.getCollection('drinks').ensureIndex({'name' : 'text'});
db.getCollection('products').ensureIndex({'name' : 'text'});

