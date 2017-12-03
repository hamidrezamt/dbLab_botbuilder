"use strict"
var mysql = require('mysql');
var TelegramBot = require('node-telegram-bot-api');

let config = require('./config.js');

var con = mysql.createConnection(config);

var telegram = new TelegramBot("426374989:AAGC3SFMFjILF8WSAM_ZcZlfkKsnfWSLYqk", { polling: true });

var index = 0;
var table = "Pizza";
var max;

var firsKeyboard = {
    "reply_markup": {
        "keyboard": [
            ["منوی غذا", "شعب برگرلند"]
        ],
        "resize_keyboard": true,
    }
};
var menuKeyboard = {
    "reply_markup": {
        "keyboard": [
            ["برگر", "پیتزا"],
            ["پیش غذا", "نوشیدنی"],
            ["بازگشت"]
        ],
        "resize_keyboard": true,
    }
};

function getKeyboard(id) {
    var sql = "SELECT * FROM Keyboards WHERE id = \'" + id + "\'"
    var res = con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Hoorraa!")
        console.log(result[0].name);
        return result[0].name;
    });
    return res;
}




telegram.onText(/\/start/, function(message) {

    var sql = "INSERT INTO Customers (username) VALUES ('" + message.chat.username + "')";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("a username inserted");
    });
    telegram.sendMessage(message.chat.id, "به بات فست‌فود برگرلند خوش آمدید.", firsKeyboard);
});

telegram.onText(/منو/, function(message) {
    telegram.sendMessage(message.chat.id, "دسته بندی غذای مد نظر خود را انتخاب کنید.", menuKeyboard);
    console.log()
});

function imagExtract(msg, tbl, inx) {
    var sql = "SELECT * FROM " + tbl;
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("the table is " + tbl + " and the index is: " + inx);
        var photo = JSON.parse(JSON.stringify(result[inx].picture));
        var caption = { caption: JSON.parse(JSON.stringify(result[inx].name)) + "\n قیمت: " + JSON.parse(JSON.stringify(result[inx].price)) + " تومان" }
        telegram.sendPhoto(msg.chat.id, photo, caption, {
            "reply_markup": {
                "keyboard": [
                    ["◀️", "▶️"],
                    ["بازگشت"]
                ],
                "resize_keyboard": true,
            }
        });
    });
}

// function maxIs(tbl, mx) {
//     var query = "SELECT id FROM " + tbl + " ORDER BY id DESC LIMIT 1";
//     con.query(query, function(err, result) {
//         if (err) throw err;
//         mx = parseInt(JSON.parse(JSON.stringify(result[0].id)));
//     });
//     console.log("max is = " + mx)
// }

telegram.onText(/برگر/, function(message) {
    index = 0;
    table = "Burger_Sandwich"
    var maxQuery = "SELECT id FROM " + table + " ORDER BY id DESC LIMIT 1";
    con.query(maxQuery, function(err, result) {
        if (err) throw err;
        max = parseInt(JSON.parse(JSON.stringify(result[0].id)));
    });
    imagExtract(message, table, index);
    telegram.sendMessage(message.chat.id, "برای دیدن انواع برگرها از ▶️ و ◀️ استفاده کنید.", {
        "reply_markup": {
            "keyboard": [
                ["◀️", "▶️"],
                ["بازگشت"]
            ],
            "resize_keyboard": true,
        }
    });
});

telegram.onText(/پیتزا/, function(message) {
    index = 0;
    table = "Pizza"
    var maxQuery = "SELECT id FROM " + table + " ORDER BY id DESC LIMIT 1";
    con.query(maxQuery, function(err, result) {
        if (err) throw err;
        max = parseInt(JSON.parse(JSON.stringify(result[0].id)));
    });
    imagExtract(message, table, index);
    telegram.sendMessage(message.chat.id, "برای دیدن انواع پیتزا از ▶️ و ◀️ استفاده کنید.", {
        "reply_markup": {
            "keyboard": [
                ["◀️", "▶️"],
                ["بازگشت"]
            ],
            "resize_keyboard": true,
        }
    });
});


telegram.onText(/پیش غذا/, function(message) {
    index = 0;
    table = "Appetizer"
    var maxQuery = "SELECT id FROM " + table + " ORDER BY id DESC LIMIT 1";
    con.query(maxQuery, function(err, result) {
        if (err) throw err;
        max = parseInt(JSON.parse(JSON.stringify(result[0].id)));
    });
    imagExtract(message, table, index);
    telegram.sendMessage(message.chat.id, "برای دیدن انواع پیتزا از ▶️ و ◀️ استفاده کنید.", {
        "reply_markup": {
            "keyboard": [
                ["◀️", "▶️"],
                ["بازگشت"]
            ],
            "resize_keyboard": true,
        }
    });
});

telegram.onText(/▶️/, function(message) {
    ++index;
    console.log("max is: " + max);
    if (index < max) {
        imagExtract(message, table, index);
    } else {
        index = 0;
        imagExtract(message, table, index);
    }
});

telegram.onText(/◀️/, function(message) {
    --index;
    console.log("max is: " + max);
    if (index >= 0) {
        imagExtract(message, table, index);
    } else if (index < 0) {
        index = max - 1;
        imagExtract(message, table, index);
    }
});

telegram.onText(/بازگشت/, function(message) {
    index = 0;
    telegram.sendMessage(message.chat.id, "بازگشت", {
        "reply_markup": {
            "keyboard": [
                ["منوی غذا", "شعب برگرلند"]
            ],
            "resize_keyboard": true,
        }
    });
});

telegram.onText(/شعب برگرلند/, function(message) {
    telegram.sendMessage(message.chat.id, "شعب برگرلند", {
        "reply_markup": {
            "keyboard": [
                ["شعبه پاسداران", "شعبه اندرزگو"],
                ["شعبه تهران‌پارس", "شعبه سعادت‌آباد"],
                ["بازگشت"]
            ],
            "resize_keyboard": true,
        }
    });
});

telegram.onText(/اندرزگو/, function(message) {
    telegram.sendMessage(message.chat.id, "اطلاعات شعبه");
    telegram.sendLocation(message.chat.id, 35.796677, 51.470217, {
        "reply_markup": {
            "keyboard": [
                ["شعبه پاسداران", "شعبه اندرزگو"],
                ["شعبه تهران‌پارس", "شعبه سعادت‌آباد"],
                ["بازگشت"]
            ],
            "resize_keyboard": true,
        }
    });

});

telegram.onText(/پاسداران/, function(message) {
    telegram.sendMessage(message.chat.id, "اطلاعات شعبه");
    telegram.sendLocation(message.chat.id, 35.80706, 51.42810, {
        "reply_markup": {
            "keyboard": [
                ["شعبه پاسداران", "شعبه اندرزگو"],
                ["شعبه تهران‌پارس", "شعبه سعادت‌آباد"],
                ["بازگشت"]
            ],
            "resize_keyboard": true,
        }
    });
});

telegram.onText(/سعادت‌آباد/, function(message) {
    telegram.sendMessage(message.chat.id, "اطلاعات شعبه");
    telegram.sendLocation(message.chat.id, 35.80706, 51.42810, {
        "reply_markup": {
            "keyboard": [
                ["شعبه پاسداران", "شعبه اندرزگو"],
                ["شعبه تهران‌پارس", "شعبه سعادت‌آباد"],
                ["بازگشت"]
            ],
            "resize_keyboard": true,
        }
    });
});

telegram.onText(/تهران‌پارس/, function(message) {
    telegram.sendMessage(message.chat.id, "اطلاعات شعبه");
    telegram.sendLocation(message.chat.id, 35.80706, 51.42810, {
        "reply_markup": {
            "keyboard": [
                ["شعبه پاسداران", "شعبه اندرزگو"],
                ["شعبه تهران‌پارس", "شعبه سعادت‌آباد"],
                ["بازگشت"]
            ],
            "resize_keyboard": true,
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