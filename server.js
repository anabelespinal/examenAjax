var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));
app.listen(1000, function(){
  console.log("servidor encendido puerto 1000");
});
