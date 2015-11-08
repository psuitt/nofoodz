Statistics = new Meteor.Collection("statistics");

Statistics.allow({
  insert: function (userId, food) {
    return false;
  },
  update: function (userId, food) {
    return false;
  },
  remove: function (userId, food) {
    // not possibly yet
    return false;
  }
});

Statistics.deny({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});
