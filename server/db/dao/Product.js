/**
 * Created by Sora on 8/25/2015.
 */
Product = class Product extends AbstractItem {

    constructor(name, brandId, brandName, keywords, tags, user, rating) {
        super(Products, name, brandId, brandName, keywords, tags, user, rating)
    }

};
