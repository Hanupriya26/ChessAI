Basics Components:

	1. NodeJs is our backend server-side language. We use following packages/libraries in NodeJs-
	-	Express			:- Our webserver 
	-	Path			:- To easily get path variables to folder
	-	Body-Parser		:- To parse the request content which is in JSON format, URL encoded
	-	child_process	:- To spawn a child process to run the python script to find best move
	-	async			:- To have synchronous piece of code (explained in step 8)
	
	2. Javascript is our frontend client-side language. We use following packages/libraries in Javascript-
	-	chessboard-js	:- To create a chessboard object with chess piece objects
	-	chess.js 		:- Chess functions like list of valid moves, etc.
	-	jQuery			:- Simplify HTML
	
	3. Python as our scripting language to find the best move at a given position.We use following packages/libraries in Python-
	-	python-chess	:- To render the given position and get list of valid moves for iteration.
	
	
Basic Working/Workflow:

	1. Get request from client, handled by app.get() in server.js. Returns respective file.
	2. The html file creates and renders chessboard object with chess piece objects. 
	3. After the user makes a move in the chessboard interface, the client-side (html page) creates a post request (done using XMLHttpRequest) and sends the current board position as a JSON object to the backend.
	4. Backend server.js handles this request in /curpos and parses the request to obtain the current position as a JSON object. 
	5. The backend spaws a python process having the current board position as a parameter. This python process takes the parameters as input and finds the best move possible at that position (done using Min-Max, Alpha-Beta pruning, etc).
	6. The output of the python file (in stdout) is the best move calculated. 
	7. server.js gets this output from childProcess.stdout object. The backend now obtains the best move.
	8. NodeJs has non-blocking I/O (google this). Hence, to make the function wait for the output from the python script to return the best move value to front-end(instead of immediately returning NULL value), we need synchronous step-by-step execution - make the function wait for the output to come rather than immediately returning NULL. 
	9. Front-end recieves the best move as the response of the XMLHttpRequest.
	10. Renders the move caluclated, and the user has his turn again. 