import sys
import chess
import random
import positionValue

def minimaxBest(depth, board):
	moveList = board.legal_moves
	valBest = 100000
	moveBest = ""
	for moveItr in moveList:
		board.push(moveItr)
		#print(moveItr,end=" ")
		value = minimax(depth-1, board, -100000, 100000, True)
		#print(value)
		board.pop()
		if value == valBest:
			if random.random()*100 < 20:
				moveBest = moveItr
		if value < valBest:
			valBest = value
			moveBest = moveItr
	return moveBest

def minimax(depth, board, alpha, beta, isMax):
	if depth == 0:
		return evaluate(board)
	else:
		moveList = board.legal_moves
		if isMax:
			value = -100000
			for moveItr in moveList:
				board.push(moveItr)
				value = max(value, minimax(depth-1, board, alpha, beta, False))
				board.pop()
				alpha = max(alpha, value)
				if beta <= alpha:
					return value
			return value
		else:
			value = 100000
			for moveItr in moveList:
				board.push(moveItr)
				value = min(value, minimax(depth-1, board, alpha, beta, True))
				board.pop()
				beta = min(beta, value)
				if beta <= alpha:
					return value
			return value
    			
def evaluate(board):
	boardEval = 0
	for i in range(0,64):
		#print(i,end=" ")
		boardEval += getValue(str(board.piece_at(i))) + positionValue.posFactor(str(board.piece_at(i)),i)
		#print(board.piece_at(i))
	return boardEval

def getValue(piece): 		#check-out https://www.chessprogramming.org/Simplified_Evaluation_Function
	if piece == None:
		return 0
	elif piece == "p":
		return -100
	elif piece == "P":
		return 100
	elif piece == "n":
		return -320
	elif piece == "N":
		return 320
	elif piece == "b":
		return -330	
	elif piece == "B":
		return 330		
	elif piece == "r":
		return -500
	elif piece == "R":
		return 500
	elif piece == "q":
		return -900
	elif piece == "Q":
		return 900
	elif piece == "k":
		return -20000
	elif piece == "K":
		return 20000
	else:
		return 0

boardPos = ""

for eachArg in sys.argv[1:]:   
	boardPos = boardPos + eachArg + " "

board = chess.Board(boardPos)
legal_moves = [x for x in board.legal_moves] 	#check https://github.com/niklasf/python-chess/issues/226

#print(board.legal_moves)

#randMoveIndex = random.randint(0,len(legal_moves)-1)
bestMove = minimaxBest(3,board)

#print(evaluate(board))

#print(legal_moves[randMoveIndex])	
print(bestMove)