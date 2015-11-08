Words = new Meteor.Collection("words");

Words.allow({
  insert: function () {
    return false;
  },
  update: function () {
    return false;
  },
  remove: function () {
    // not possibly yet
    return false;
  }
});
