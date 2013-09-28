var request = require("request");

exports.getDetails = function getDetails(cb) {
  var options = {
    uri: "http://socialclub.rockstargames.com/games/gtav/ajax/stockdetail",
    json: true,
  };

  request(options, function(err, res, data) {
    if (err) {
      return cb(err);
    }

    if (res.statusCode !== 200) {
      return cb(Error("invalid status code; expected 200 but got " + res.statusCode));
    }

    if (typeof data !== "object" || data === null) {
      return cb(Error("response wasn't an object"));
    }

    if (!data.Stocks) {
      return cb(Error("couldn't find stock info"));
    }

    return cb(null, data.Stocks);
  });
};
