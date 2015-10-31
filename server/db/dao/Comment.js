/**
 * Created by Sora on 8/25/2015.
 */
Comment = function (id, type, comments) {

    // Id of the product or food
    this._id = id;
    // Type of item
    this.type = type;
    // Comments array
    this.comments = comments;
    this.date = date ? date : Date.now();

};