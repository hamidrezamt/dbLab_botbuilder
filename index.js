"use strict"
var mysql = require('mysql');
var TelegramBot = require('node-telegram-bot-api');

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "mydb"
});

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "ALTER TABLE customers ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table altered");
//     });
// });


// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "CREATE TABLE Messages (id INT AUTO_INCREMENT PRIMARY KEY, content VARCHAR(255))";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table created");
//     });
// });


var telegram = new TelegramBot("426374989:AAGC3SFMFjILF8WSAM_ZcZlfkKsnfWSLYqk", { polling: true });

telegram.onText(/\/start/, function(message){

    telegram.sendMessage(message.chat.id, "به بات رستوران شاندیز گلوریا خوش آمدید.", {
    "reply_markup": {"keyboard": [["منوی غذا", "شعب رستوران"]]}
    }
    );
});

telegram.onText(/منوی غذا/, function(message){

    telegram.sendMessage(message.chat.id, "s‌",{
            "reply_markup": {"keyboard": [["امکانات" , "انصراف"]]}
        }
    );
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

telegram.on('message', function (message) {


        var sql = "INSERT INTO Messages (content) VALUES ('" + message.text + "')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("a record inserted");

        });

        var sql2  = "SELECT * FROM Messages ORDER BY id DESC LIMIT 1"
        con.query(sql2, function (err, result) {
            if (err) throw err;
            console.log("a record selected");
            var rows = JSON.parse(JSON.stringify(result[0].content));
            telegram.sendMessage(message.chat.id, rows);
            // console.log(rows);
            // telegram.sendMessage(message.chat.id, JSON.stringify(result2.content));
        });


});

