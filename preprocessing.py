from stockfish import Stockfish  
import chess
import io
from chess import pgn 
import json
#TODO:
#split pgn into games,
#get all players from the games
#get all links from the games


#ask sqbl what he needs

#sf=Stockfish(path='/home/felix/Desktop/uni/data_vis/data_vis/stockfish_15.1_linux_x64_avx2/stockfish-ubuntu-20.04-x86-64-avx2')

def fileProcessing():
    pgn_file=open('multi-games-pgn.pgn','r',encoding='utf-8').read()
    games=pgn_file.split('[Site "http://www.chessbomb.com"]')
    return games

def turnToFen(game):
    board=game.board()
    i=1
    game_fens={}
    for move in game.mainline_moves():
        print(move)
        board.push(move)
        fen=board.fen()
        if i%1==0.5:
            game_fens[f"{int(i//1)}b"]=fen
        else:
            game_fens[f"{int(i//1)}w"]=fen
        i+=0.5 
    return game_fens

def stockfishGame(game,name):
    pass
    #need to get player names and round number
    #for unqiue file name
    

def gameProcessing(games):
    FENS={}
    EVALS={}
    for game in games:
        game=io.StringIO(game)
        game=pgn.read_game(game)
        white=game.headers['White']
        black=game.headers['Black']
        round=game.headers['Round']
        name=nameGen(white,black,round)
        FENS[name]=turnToFen(game)
        #stockfishGame(game,name)
    with open("fens.json", "w") as outfile:
        json.dump(FENS, outfile)



def nameGen(white,black,round):
    white=white.replace(' ','_')
    black=black.replace(' ','_')
    white=white.replace(',','')
    black=black.replace(',','')
    temp=white+'_'+black+'_'+round
    return temp

if __name__ == "__main__":
    g=fileProcessing()
    gameProcessing(g)