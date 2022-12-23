from stockfish import Stockfish  
import chess
import io
from chess import pgn 
import json
#TODO:
#split pgn into games,
#get all players from the games
#get all links from the games
test_Fen="r2rn3/5p2/2pNk1p1/1p2P1Pp/p1p2P2/P4K1P/1PPR4/3R4 b - - 5 28"

#booleans for fen/evals/tournament
bFen,bEvals,bTournament,bMoves=False,False,False,True
#ask sqbl what he needs

sf=Stockfish(path='./stockfish/stockfish-ubuntu-20.04-x86-64-avx2',parameters={"Threads":4,"Hash":2048})


sf.set_fen_position(test_Fen)
print(sf.get_evaluation())
#cp = centipawns
#mate = mate in x moves
#- means black is better

def fileProcessing():
    pgn_file=open('multi-games-pgn.pgn','r',encoding='utf-8').read()
    games=pgn_file.split('[Site "http://www.chessbomb.com"]')
    return games

def turnToFen(game):
    board=game.board()
    i=1
    game_fens={}
    for move in game.mainline_moves():
        board.push(move)
        fen=board.fen()
        if i%1==0.5:
            game_fens[f"{int(i//1)}b"]=fen
        else:
            game_fens[f"{int(i//1)}w"]=fen
        i+=0.5 
    return game_fens

def stockfishGame(game):
    #maybe plausible with the fen dict
    evals=[]
    for i in game.keys():
        sf.set_fen_position(game[i])
        evals.append(sf.get_evaluation())
    return evals
    #need to get player names and round number
    #for unqiue file name

def addPlayer(player_name,elo,players_dict):
    player={}
    players_dict[player_name]={}
    players_dict[player_name]["id"]=len(players_dict.keys())
    players_dict[player_name]["name"]=' '.join([i.strip() for i in player_name.split(',')][::-1])
    players_dict[player_name]["elo"]=elo
    return players_dict

def addLink(game_name,game,player_dict,links_dict):
    white=game.headers['White']
    black=game.headers['Black']
    links_dict[game_name]={}
    links_dict[game_name]["white"]=player_dict[white]["id"]
    links_dict[game_name]["black"]=player_dict[black]["id"]
    links_dict[game_name]["round"]=game.headers['Round']
    links_dict[game_name]["id"]=len(links_dict.keys())
    links_dict[game_name]["game_name"]=game_name

    result=game.headers['Result']
    if result=="1-0":
        links_dict[game_name]["winner"]=player_dict[white]["id"]
    elif result=="0-1":
        links_dict[game_name]["winner"]=player_dict[black]["id"]
    else:
        links_dict[game_name]["winner"]=-1
    return links_dict

def addGame(game_name,game, games_dict):
    #add player name to dict, add unique id, 
    #add name with _ used in game namen
    #add links to 
    links=games_dict["games"]
    players=games_dict["players"]
    white=game.headers['White']
    black=game.headers['Black']
    if not white in players.keys():
        players=addPlayer(white,game.headers["WhiteElo"],players)
    if not black in players.keys():
        players=addPlayer(black,game.headers["BlackElo"],players)
    links=addLink(game_name,game,players,links)
    return {"players":players,"games":links}

piece_dict={"p":"pawn","r":"rook","n":"knight","b":"bishop","q":"queen","k":"king"}

def digest(game):
    board=game.board()
    white=True
    moves=[]
    for move in game.mainline_moves():
        taken_piece=""
        taking=board.is_capture(move)
        if taking:
            if board.is_en_passant(move):
                taken_piece="pawn"
            else:
                taken_piece=piece_dict[board.piece_at(move.from_square).symbol().lower()]
        print(taking)
        board.push(move)
        to=move.uci()[2:3]
        piece=piece_dict[board.piece_at(move.to_square).symbol().lower()]
        color="white" if white else "black"
        checked=board.is_check()
        king_pos=board.king(not white)
        white=not white
        move={"piece":piece,"to":to,"color":color,"checked":checked,"enemy_k":king_pos,"taking":taking,"took":taken_piece}
        moves.append(move)
    return moves

def nameGen(white,black,round):
    temp=white+'_'+black+'_'+round
    temp=temp.replace(' ','_')
    temp=temp.replace(',','')
    return temp

def gamesProcessing(games):
    FENS={}
    EVALS={}
    #players= {id,name with _, name, country, elo}
    #games= {white, black, winner, round, maybe id}
    TOURNAMENT={"players":{},"games":{}}
    MOVES={}
    for game in games:
        game=io.StringIO(game)
        game=pgn.read_game(game)
        white=game.headers['White']
        black=game.headers['Black']
        round=game.headers['Round']
        name=nameGen(white,black,round)
        if bFen or bEvals:
            FENS[name]=turnToFen(game)
        if bEvals:
            EVALS[name]=stockfishGame(FENS[name])
        if bTournament:
            TOURNAMENT=addGame(name,game,TOURNAMENT)
        if bMoves:
            MOVES[name]=digest(game)
        print(f"game {name} done")
    if bFen:
        with open("assets/jsons/fens.json", "w") as outfile:
            json.dump(FENS, outfile)
    if bEvals:
        with open("assets/jsons/evals.json", "w") as outfile:
            json.dump(EVALS, outfile)
    if bTournament:
        with open("assets/jsons/tournament.json", "w") as outfile:
            json.dump(TOURNAMENT, outfile)
    if bMoves:
        with open("assets/jsons/moves.json", "w") as outfile:
            json.dump(MOVES, outfile)

if __name__ == "__main__":
    g=fileProcessing()
    gamesProcessing(g)