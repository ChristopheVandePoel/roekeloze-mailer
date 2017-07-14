var nodemailer = require('nodemailer');
var express = require('express');
var bodyParser = require('body-parser');
const credentials = require('./credentials.js');

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', credentials.cors);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(allowCrossDomain);

app.post('/mail', function(req, res) {
	console.log('request received ', req.body, credentials);
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
			auth: {
				user: credentials.email,
				pass: credentials.pass
			}
		});

	var text = `Message from: ${req.body.name} - ${req.body.email} \n
	${req.body.message}`;

	var mailOptions = {
		from: credentials.email, // sender address
		to: 'christophe@roekeloos.be', // list of receivers
		subject: 'Email from Roekeloos.be', // Subject line
		text: text //, // plaintext body
		// html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
	};
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			res.status(500);
			res.json({yo: 'error'});
		}else{
			console.log('Message sent: ' + info.response);
			res.json({yo: info.response});
		};
	});
});

app.listen(9991, function() {
	console.log('running mail server on 9991');
});
