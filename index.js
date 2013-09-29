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

    if (!data.Stocks || !Array.isArray(Stocks)) {
      return cb(Error("couldn't find stock info"));
    }

    var stocks = data.Stocks.map(function(stock) {
      return {
        company: {
          code: stock.CompanyCode,
          name: stock.CompanyName,
          summary: stock.Summary,
        },
        price: {
          index: stock.Index,
          current: parseFloat(stock.CurrentPrice.replace("$", "")),
          high: parseFloat(stock.HighPrice.replace("$", "")),
          low: parseFloat(stock.LowPrice.replace("$", "")),
          movement: {
            amount: parseFloat(stock.PriceMovement.replace("$", "")),
            percent: stock.PriceMovementPercent,
            direction: stock.PriceMovementDirection,
            total: {
              amount: stock.TotalPriceMovement,
              percent: stock.TotalPriceMovement,
            },
          },
          history: stock.PriceHistory.split(",").map(parseFloat),
        },
        modifiers: stock.Modifiers,
      };
    }).sort(function(a, b) {
      return a.company.code > b.company.code ? 1 : -1;
    }).reduce(function(i, v) {
      i[v.company.code] = v;

      return i;
    }, {});

    return cb(null, stocks, data);
  });
};
