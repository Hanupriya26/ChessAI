var express = require("express");
var app = express();
var path = require('path');
var bodyParser = require("body-parser");
var spawn = require("child_process").spawn;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/public',express.static(path.join(__dirname,'public')));
app.use('/modules',express.static(path.join(__dirname,'node_modules')));

app.get('/index.html', function (req, res) {
	console.log("Index - GET");
	res.sendFile(path.join(__dirname,"views/index.html"));
});

app.get('/bot1.html', function (req, res) {
	console.log("Bot1 - GET")
	res.sendFile(path.join(__dirname,"views/bot1.html"));
});

app.post('/curpos',function (req, res){
	var nextMove = "init";

	async function spawnChild(){
		var boardFEN = req.body['game'];
		//console.log(boardFEN);
		//Because path not detected in python script, use this if Windows
		//var pythonProcess = spawn('C:/Users/Aravind Ravikumar/AppData/Local/Programs/Python/Python37/python.exe',["public/chess_engine/minimax.py",boardFEN]);		
		var pythonProcess = spawn("/usr/bin/python3",["public/chess_engine/minimaxAlphaBeta.py",boardFEN]);
		var data = "";
		var error = "";

		/*
		pythonProcess.stdout.on('data', function(data){
			console.log(data.toString());
			nextMoveData += data.toString();
		});
		pythonProcess.stderr.on('data', function(data){
			console.log("Error in script");
			console.log(data.toString());
		});
		*/

		for await (const chunk of pythonProcess.stdout) {
			data += chunk;
		}

		for await (const chunk of pythonProcess.stderr) {
			error += chunk;
		}

		const exitCode = await new Promise( (resolve, reject)=> {
			pythonProcess.on('close', resolve);
		});
	
		if(exitCode) {
			throw new Error(`subprocess error exit ${exitCode}, ${error}`);
		}

		return data;
	}

	spawnChild().then( function(data,err){
		console.log(data);
		nextMove = data.toString();
		res.send(JSON.stringify(nextMove));
	});
});

 var server = app.listen(3073, "127.0.0.1", function () {
	var host = server.address().address;
	var port = server.address().port;
 
	console.log("Chess bot running at http://%s:%s", host, port);
 });