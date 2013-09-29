#!/usr/bin/env node

var bawsaq = require("./");

bawsaq.getDetails(function(err, res) {
  console.log(err, res);
});
