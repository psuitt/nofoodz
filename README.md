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

Windows

To set the meteor Mongo_Url local dev: set MONGO_URL=mongodb://localhost:27017/your_db

#DB Indexes
db.getCollection('brands').ensureIndex({'name' : 'text'});

db.getCollection('foods').ensureIndex({'name' : 'text'});

db.getCollection('food_ratings').ensureIndex({'random' : 1});

db.getCollection('food_ratings').ensureIndex({'name_view' : 'text'});

db.getCollection('drinks').ensureIndex({'name' : 'text'});

db.getCollection('drink_ratings').ensureIndex({'random' : 1});

db.getCollection('drink_ratings').ensureIndex({'name_view' : 'text'});

db.getCollection('products').ensureIndex({'name' : 'text'});

db.getCollection('product_ratings').ensureIndex({'random' : 1});

db.getCollection('product_ratings').ensureIndex({'name_view' : 'text'});

db.getCollection('medias').ensureIndex({'name' : 'text'});

db.getCollection('media_ratings').ensureIndex({'random' : 1});

db.getCollection('media_ratings').ensureIndex({'name_view' : 'text'});

db.getCollection('others').ensureIndex({'name' : 'text'});

db.getCollection('other_ratings').ensureIndex({'random' : 1});

db.getCollection('other_ratings').ensureIndex({'name_view' : 'text'});
