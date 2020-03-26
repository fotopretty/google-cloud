/* eslint-disable func-style */
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
//const request = require('request');
const axios = require('axios');
const favicon = require('serve-favicon');
const QRCode = require('qrcode');
const app = express();

const CryptoJS = require("crypto-js");
var timestamp = getTime();
var clientId = "7jjnraunnecy5v8wagcs";
var secret = "ccstmmr7ama8typs55qufupk5tw4pyak";
var sign = calcSign(clientId, secret, timestamp);
//var signUser = calcSignUser(clientId, secret, timestamp);

app.set('view engine', 'ejs');
//app.use(express.urlencoded());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(favicon(__dirname + '/favicon.ico'));
app.use('/javascript', express.static('javascript'));
app.use('/json', express.static('json'));
app.use('/image', express.static('image'));


//app.set('view options', {delimiter: '?'});

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

// CryptoJS Constant
//const message, nonce, path, privateKey;
//const hashDigest = sha256(nonce + message);
//const hmacDigest = Base64.stringify(hmacSHA512(path + hashDigest, privateKey));


/* const admin = require('firebase-admin');

let serviceAccount = require('f:/gnode/nodejs-262923-3c242afaedcd.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();
 */
app.get('/', (req, res) => {
  console.log('home');
  res
    .status(200)
    .render('home');
});

app.get('/member', (req, res) => {
  let tempCollection = [];
  let userRef = db.collection('users');
  let getDoc = userRef.get()
    .then(snapshot => {

      snapshot.forEach(doc => {
        tempCollection.push(doc.data());
      });
      console.log(tempCollection);

      res
        .status(200)
        .render('usertable', {
          todos: tempCollection
        });
    })
    .catch((err) => {
      console.log('Error get', err);
    });

});

app.get('/view/:name', (req, res) => {
  /*   var data = { names: req.params.name, age: 15, job: 'program' };
    res.render('profile', { user: data }); */
  let tempCollection = [];
  let userRef = db.collection('users');
  let queryRef = userRef.where('first', '==', req.params.name);
  let getDoc = queryRef.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        tempCollection.push(doc.data());
      });
      console.log(tempCollection);
      res
        .status(200)
        .render('usertable', {
          todos: tempCollection
        });
    })
    .catch((err) => {
      console.log('Error get', err);
    });

});

app.get('/register', (req, res) => {
  console.log('Register Form');
  res.render('formregister');
});


app.post('/registersave', (req, res) => {

  let register = {
    first: req.body.fname,
    last: req.body.lname,
    email: req.body.email,
    mobilenumber: req.body.mobileno,
    id: req.body.UserId,
    user: req.body.UserInfo,
    idemail: req.body.IdToken,
    idprovince: req.body.province,
    idamphur: req.body.amphur,
    iddistrict: req.body.district,
    postalcode: req.body.postcode,
    pictureurl: req.body.pictureUrl
  };

  let docRef = db
    .collection('users')
    .add(register)
    .then(ref => {
      console.log('add ref id: ', ref.id);
    });

  res.render('registsave', {
    userValue: register
  });
  //res.send('ok');
});

/* 
app.get('/province', (req, res) => {
  console.log('province');
  res.render('province')
});

app.post('/provincesave', (req, res) => {
  var register = {
    province_id: req.body.province_id,
    province_name: req.body.province_name
  };
  let docRef = db
    .collection('province')
    .add(register)
    .then(ref => {
      console.log('add ref id: ', ref.id);
    });
  res.render('province');

});

app.get('/provinceview', (req, res) => {
  let tempCollection = [];
  let userRef = db.collection('province').orderBy('province_id');
  let getDoc = userRef.get()
    .then(snapshot => {

      snapshot.forEach(doc => {
        tempCollection.push(doc.data());
      });
      console.log(tempCollection);

      res
        .status(200)
        .render('provinceview', { todos: tempCollection });
    })
    .catch((err) => {
      console.log('Error get', err);
    });


});
 */
/* app.get('/set/:message', (req, res) => {
  console.log('Request:' + req.params.message + ' = ' + new Date(), req.method, req.url);
  const { params } = req;
  req.myobj = params;
  let docRef = db.collection('users').add({
    user: req.params.message,
    born: 2000
  })
    .then(ref => {
      console.log('add ref id: ', ref.id);
    });
  res.send(req.params.message);
});
 */

/* app.get('/javafire', (req, res) => {
  console.log('java fire');
  res
    .status(200)
    .render('javafire');
}); */

app.get('/product', (req, res) => {
  console.log('product');
  res
    .status(200)
    .render('product');
});

app.get('/qrcode', (req, res) => {
  console.log('qrcode gen');
  res
    .status(200)
    .render('qrcodegen');
});

app.get('/qrcoderead', (req, res) => {
  console.log('qrcode scan');
  let msgReq = req.query.userid;
  let uuidReq = req.query.uuid;
  console.log(msgReq);
  res.render('qrcoderead', {
    todoo: msgReq,
    uuid: uuidReq
  });
  //res.render('dbtest', { todoo: msgReq, idcode: idReq });
});

app.get('/stamps', (req, res) => {
  console.log('stamp');
  res
    .status(200)
    .render('stamp');
});

app.get('/grid', (req, res) => {
  console.log('grid');
  res
    .status(200)
    .render('grid');
});
var device_status;

setInterval(() => {
  accessToken().then((accesstoken) => {
    deviceIdStatus(accesstoken).then((data_status) => {
      console.log(data_status);
      if ((data_status === true) && (device_status === false)) {
        device_status = true;
        console.log(device_status);
        lineSendmsg(data_status);
      }
      if (data_status === false) {
        device_status = false;
        console.log(device_status);
      }

    });
  });

}, 60000);



app.get('/webhook', (req, res) => {
  accessToken().then((accesstoken) => {
    //console.log(accesstoken);
    deviceIdStatus(accesstoken).then((data_status) => {
      console.log(data_status);
      if ((data_status === true) && (device_status === false)) {
        device_status = true;
        console.log(device_status);
        lineSendmsg(data_status);
      }
      if (data_status === false) {
        device_status = false;
        console.log(device_status);
      }
    });
    res.sendStatus(200);
  });

});


function getTime() {
  var date = new Date();
  var timestamp = date.getTime();
  return timestamp;
};

function calcSign(clientId, secret, timestamp) {
  //var calcSign = function (req, res, next) {
  var str = clientId + timestamp;
  var hash = CryptoJS.HmacSHA256(str, secret);
  var hashInBase64 = hash.toString();
  var signUp = hashInBase64.toUpperCase();
  return signUp;
};

function calcSignUser(clientId, secret, timestamp, accesstoken) {
  //  accessToken().then((accesstoken) => {
  //console.log(accesstoken);
  var str = clientId + accesstoken + timestamp;
  var hash = CryptoJS.HmacSHA256(str, secret);
  var hashInBase64 = hash.toString();
  var signUp = hashInBase64.toUpperCase();
  //console.log('return ' + signUp);
  return signUp;
  //  });

};

async function lineSendmsg(msgReq) {
  try {
    console.log(msgReq);
    if (msgReq === false) {
      var statusSwitch = 'Close สวิทซ์ปิดอยู่';
    } else {
      var statusSwitch = 'มีเหตุด่วน คลิก line://app/1653797799-QMxjx51r';
    }

    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer jyQpp6yhdArbHTZHvjZ9X12FzAJv4MQx6Bxm8pGde7EcWmm3x5qP+A1mUqhnRDGxE3pGkwXx62dY8CBU1oDQv0MhMZ6dEIPXyKQnhINJUeJi9dUn9diWqsO/Woy7T2tjXp4MNZ4IdM7g2ljkqhk5/gdB04t89/1O/w1cDnyilFU='
    };
    let dataS = {
      to: ['U09bcadc596dbf3000e83ef72a7000d91', 'Uac09003bf291fe3058f76ffba32db948'],
      messages: [{
        type: 'text',
        text: statusSwitch
      }]
    };

    console.log(headers);
    console.log(dataS);

    const tData = await axios.post('https://api.line.me/v2/bot/message/multicast', dataS, {
      headers: headers
    }).then((res) => {
      //console.log(res);
      console.log('send message');
      return res;
    }).catch(error => {
      console.log(error);
    });
    console.log('send ok');
  } catch (err) {
    console.error(err);
  }
};

async function accessToken() {
  try {
    var requestOptions = {
      method: 'GET',
      url: 'https://openapi.tuyaus.com/v1.0/token?grant_type=1',
      headers: {
        'client_id': clientId,
        'sign': sign,
        't': timestamp,
        'sign_method': 'HMAC-SHA256'
      },
      json: true,
      redirect: 'follow'
    };
    const data = await axios(requestOptions)
      .then(res => {
        var accesstoken = res.data.result.access_token;
        return accesstoken;
      });

    return data;

  } catch (err) {
    console.error(err);
  }

};

async function deviceIdStatus(accesstoken) {
  try {
    var sign = await calcSignUser(clientId, secret, timestamp, accesstoken);
    //console.log(sign);
    var requestOptions = {
      method: 'GET',
      url: 'https://openapi.tuyaus.com/v1.0/devices/002006695ccf7fba237e/status',
      headers: {
        'client_id': clientId,
        'sign': sign,
        't': timestamp,
        'access_token': accesstoken,
        'sign_method': 'HMAC-SHA256'
      },
      json: true,
      redirect: 'follow'
    };
    //console.log(requestOptions);
    const data = await axios(requestOptions)
      .then(res => {
        var deviceStatus = res.data.result[2].value;
        return deviceStatus;
      })
      .catch(error => {
        console.log(error);
      });
    return data;

  } catch (err) {
    console.error(err);
  }
};


app.post('/webhook', (request, response) => {
  console.log('webhookkkk');
  let userMsg = request.body.events[0].message.text
  let sender = request.body.events[0].source.userId
  let token = request.body.events[0].replyToken;
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer jyQpp6yhdArbHTZHvjZ9X12FzAJv4MQx6Bxm8pGde7EcWmm3x5qP+A1mUqhnRDGxE3pGkwXx62dY8CBU1oDQv0MhMZ6dEIPXyKQnhINJUeJi9dUn9diWqsO/Woy7T2tjXp4MNZ4IdM7g2ljkqhk5/gdB04t89/1O/w1cDnyilFU='
  };
  let data = {
    replyToken: token,
    messages: [{
      type: 'text',
      text: 'สวัสดีครับ ผม Aimesh Bot ยินดีต้อนรับครับผม ^ ^'
    }]
  };

  let dataUnknown = {
    replyToken: token,
    messages: [{
      type: 'text',
      text: 'คุณลูกค้าสอบถามไรครับ ผมไม่เข้าใจครับผม ^ ^ รบกวนสอบถามใหม่ครับ ^ ^'
    }]
  };

  let dataFlex = {
    replyToken: token,
    messages: [

      {
        "type": "template",
        "altText": "this is a carousel template",
        "template": {
          "type": "carousel",
          "columns": [{
              "thumbnailImageUrl": "https://i.imgur.com/l2rYu7Y.png",
              "imageBackgroundColor": "#FFFFFF",
              "title": "this is menu",
              "text": "description",
              "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": "http://example.com/page/123"
              },
              "actions": [{
                  "type": "postback",
                  "label": "Buy",
                  "data": "action=buy&itemid=111"
                },
                {
                  "type": "postback",
                  "label": "Add to cart",
                  "data": "action=add&itemid=111"
                },
                {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/111"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://i.imgur.com/l2rYu7Y.png",
              "imageBackgroundColor": "#000000",
              "title": "this is menu",
              "text": "description",
              "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": "http://example.com/page/222"
              },
              "actions": [{
                  "type": "postback",
                  "label": "Buy",
                  "data": "action=buy&itemid=222"
                },
                {
                  "type": "postback",
                  "label": "Add to cart",
                  "data": "action=add&itemid=222"
                },
                {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/222"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://i.imgur.com/l2rYu7Y.png",
              "imageBackgroundColor": "#000000",
              "title": "this is menu",
              "text": "description",
              "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": "http://example.com/page/222"
              },
              "actions": [{
                  "type": "postback",
                  "label": "Buy",
                  "data": "action=buy&itemid=222"
                },
                {
                  "type": "postback",
                  "label": "Add to cart",
                  "data": "action=add&itemid=222"
                },
                {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/222"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://i.imgur.com/l2rYu7Y.png",
              "imageBackgroundColor": "#000000",
              "title": "this is menu",
              "text": "description",
              "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": "http://example.com/page/222"
              },
              "actions": [{
                  "type": "postback",
                  "label": "Buy",
                  "data": "action=buy&itemid=222"
                },
                {
                  "type": "postback",
                  "label": "Add to cart",
                  "data": "action=add&itemid=222"
                },
                {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/222"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://i.imgur.com/l2rYu7Y.png",
              "imageBackgroundColor": "#000000",
              "title": "this is menu",
              "text": "description",
              "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": "http://example.com/page/222"
              },
              "actions": [{
                  "type": "postback",
                  "label": "Buy",
                  "data": "action=buy&itemid=222"
                },
                {
                  "type": "postback",
                  "label": "Add to cart",
                  "data": "action=add&itemid=222"
                },
                {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/222"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://i.imgur.com/l2rYu7Y.png",
              "imageBackgroundColor": "#000000",
              "title": "this is menu",
              "text": "description",
              "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": "http://example.com/page/222"
              },
              "actions": [{
                  "type": "postback",
                  "label": "Buy",
                  "data": "action=buy&itemid=222"
                },
                {
                  "type": "postback",
                  "label": "Add to cart",
                  "data": "action=add&itemid=222"
                },
                {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/222"
                }
              ]
            }

          ],
          "imageAspectRatio": "square",
          "imageSize": "cover"
        }
      }



    ]
  };


  let dataQuick = {
    replyToken: token,
    messages: [

      {
        "type": "text", // ①
        "text": "เลือกอาหารที่คุณชอบสิคะ",
        "quickReply": { // ②
          "items": [{
              "type": "action", // ③
              "imageUrl": "https://i.imgur.com/plEtFp5.png",
              "action": {
                "type": "message",
                "label": "Sushi",
                "text": "Sushi"
              }
            },
            {
              "type": "action",
              "imageUrl": "https://i.imgur.com/plEtFp5.png",
              "action": {
                "type": "message",
                "label": "Tempura",
                "text": "Tempura"
              }
            },
            {
              "type": "action", // ④
              "action": {
                "type": "location",
                "label": "Send location"
              }
            }
          ]
        }
      }


    ]
  };

  let dataConfirm = {
    replyToken: token,
    messages: [

      {
        "type": "template",
        "altText": "this is a confirm template",
        "template": {
          "type": "confirm",
          "text": "Are you sure?",
          "actions": [{
              "type": "message",
              "label": "Yes",
              "text": "yes"
            },
            {
              "type": "message",
              "label": "No",
              "text": "no"
            }
          ]
        }
      }

    ]
  };



  if (userMsg.split(' ')[0] === 'สวัสดี') {

    axios.post('https://api.line.me/v2/bot/message/reply', data, {
      headers: headers
    }).then((res) => {
      //console.log(res);
      console.log(sender);
    }).catach((error) => {
      //console.log(error)
    });

  } else {

    axios.post('https://api.line.me/v2/bot/message/reply', dataQuick, {
      headers: headers
    }).then((res) => {
      //console.log(res);
    }).catach((error) => {
      //console.log(error)
    });


  };


  console.log(text, sender, token);
  console.log(typeof sender, typeof text);
  response.sendStatus(200);
});



// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('App listening on port ${PORT}');
  console.log('Press Ctrl+C to quit.');

});
// [END gae_node_request_example]

module.exports = app;