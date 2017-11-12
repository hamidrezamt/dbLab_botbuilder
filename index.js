"use strict"
var mysql = require('mysql');
var TelegramBot = require('node-telegram-bot-api');

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "mydb"
});

var telegram = new TelegramBot("426374989:AAGC3SFMFjILF8WSAM_ZcZlfkKsnfWSLYqk", { polling: true });

telegram.onText(/\/start/, function(message) {

    var sql = "INSERT INTO Customers (username) VALUES ('" + message.chat.username + "')";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("a username inserted");
    });

    var option = {
        "parse_mode": "markdown",
        "reply_markup": {
            "keyboard": [
                ["منوی غذا", "شعب رستوران"],
                ["test"]
            ]
        }
    };
    telegram.sendMessage(message.chat.id, "به بات مارون خوش آمدید.", option);
});
var max;
var maxQuery = "SELECT id FROM Burger_Sandwich ORDER BY id DESC LIMIT 1";
con.query(maxQuery, function(err, result) {
    if (err) throw err;
    max = JSON.parse(JSON.stringify(result[0].id));
    max = parseInt(max);
});

telegram.onText(/test/, function(message) {


    telegram.sendMessage(message.chat.id, "reply", {
        "reply_markup": {
            "keyboard": [
                ["برگر و ساندویچ", "پیتزا"],
                ["پیش غذا", "نوشیدنی"],
                ["بازگشت"]
            ]
        }
    });
});


telegram.onText(/منوی غذا/, function(message) {

    telegram.sendMessage(message.chat.id, "دسته بندی غذای مد نظر خود را انتخاب کنید.", {
        "reply_markup": {
            "keyboard": [
                ["برگر و ساندویچ", "پیتزا"],
                ["پیش غذا", "نوشیدنی"],
                ["بازگشت"]
            ]
        }
    });
});
var index = 0;
telegram.onText(/برگر و ساندویچ/, function(message) {

    var sql = "SELECT * FROM Burger_Sandwich";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("the index is: " + index);
        var photo = JSON.parse(JSON.stringify(result[0].picture));
        var caption = { caption: JSON.parse(JSON.stringify(result[0].name)) + "\n قیمت: " + JSON.parse(JSON.stringify(result[0].price)) }
        telegram.sendPhoto(message.chat.id, photo, caption);

    });

    telegram.sendMessage(message.chat.id, "برای دیدن انواع برگر و ساندویچ‌ از ▶️ و ◀️ استفاده کنید.", {
        "reply_markup": {
            "keyboard": [
                ["◀️", "▶️"],
                ["بازگشت"]
            ]
        }
    });
});

telegram.onText(/▶️/, function(message) {

    ++index;
    if (index < max) {

        var sql = "SELECT * FROM Burger_Sandwich";
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log("the index is: " + index);
            var photo = JSON.parse(JSON.stringify(result[index].picture));
            var caption = { caption: JSON.parse(JSON.stringify(result[index].name)) + "\n قیمت: " + JSON.parse(JSON.stringify(result[index].price)) }
            telegram.sendPhoto(message.chat.id, photo, caption);
        });
    }
    telegram.sendMessage(message.chat.id, "▶️", {
        "reply_markup": {
            "keyboard": [
                ["◀️", "▶️"],
                ["بازگشت"]
            ]
        }
    });
});

telegram.onText(/◀️/, function(message) {

    --index;
    if (index >= 0) {
        var sql = "SELECT * FROM Burger_Sandwich";
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log("the index is: " + index);
            var photo = JSON.parse(JSON.stringify(result[index].picture));
            var caption = { caption: JSON.parse(JSON.stringify(result[index].name)) + "\n قیمت: " + JSON.parse(JSON.stringify(result[index].price)) }
            telegram.sendPhoto(message.chat.id, photo, caption);
        });
    }

    telegram.sendMessage(message.chat.id, "◀️", {
        "reply_markup": {
            "keyboard": [
                ["◀️", "▶️"],
                ["بازگشت"]
            ]
        }
    });
});

telegram.onText(/بازگشت/, function(message) {
    telegram.sendMessage(message.chat.id, "بازگشت", {
        "reply_markup": {
            "keyboard": [
                ["منوی غذا", "شعب رستوران"]
            ]
        }
    });
});

telegram.onText(/شعب رستوران/, function(message) {
    telegram.sendMessage(message.chat.id, "شعب رستوران مارون", {
        "reply_markup": {
            "keyboard": [
                ["شعبه تجریش", "شعبه فرمانیه"],
                ["بازگشت"]
            ]
        }
    });
});

telegram.onText(/فرمانیه/, function(message) {
    telegram.sendLocation(message.chat.id, 35.796677, 51.470217);
    telegram.sendMessage(message.chat.id, "اطلاعات شعبه", {
        "reply_markup": {
            "keyboard": [
                ["شعبه تجریش", "شعبه فرمانیه"],
                ["بازگشت"]
            ]
        }
    });
});

telegram.onText(/تجریش/, function(message) {
    telegram.sendLocation(message.chat.id, 35.80706, 51.42810);
    telegram.sendMessage(message.chat.id, "اطلاعات شعبه", {
        "reply_markup": {
            "keyboard": [
                ["شعبه تجریش", "شعبه فرمانیه"],
                ["بازگشت"]
            ]
        }
    });

});

telegram.on('message', function(message) {

    var sql = "INSERT INTO Messages (content) VALUES ('" + message.text + "')";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("**********************************");
    });

    // var sql2 = "SELECT * FROM Messages ORDER BY id DESC LIMIT 1"
    // con.query(sql2, function (err, result) {
    //     if (err) throw err;
    //     console.log("a record selected");
    //     var rows = JSON.parse(JSON.stringify(result[0].content));
    //     telegram.sendMessage(message.chat.id, rows);
    //     console.log(rows);
    // });
});