"use strict"
var mysql = require('mysql');
var res = "salam"
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "mydb"
});

getKeyboard("first");

function getKeyboard(name) {
    var sql = "SELECT * FROM Keyboards WHERE name = '" + name + "'"
    console.log(sql);
    var res2 = res;
    console.log("res2 is : " + res2);
    con.query(sql, res2, function(err, result) {
        if (err) throw err;
        // console.log("Hoorraa!")
        res2 = JSON.parse(JSON.stringify(result[0].content));
        res = res2;
        console.log("res2 in query is:" + res2);
    });
    console.log("end of getKeyboard res2 is: " + res2)
};

console.log("finall res2  is : " + res);