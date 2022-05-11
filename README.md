# Battleship
Web Technologies and Applications's class project

Game logic
Battleship is a turn-based guessing game for two players. Each player has two grids of
10x10 cells. On one grid (primary) the player arranges ships and records the shots by the
opponent. On the other grid (secondary) the player records their own shots.
A match is divided in two phases. In the first, each player arranges their ships onto the
primary grid. In the second phase the game proceeds in a series of rounds. In each round, a
player takes a turn selecting a target cell in the opponent’s grid which is to be shot at. If an
opponent’s ship is present at that location, the ship is “hit” and the corresponding cell in the
secondary grid is marked as hit. On the contrary, if no ships are present, the cell is marked
as “miss”. When all the cells occupied by a ship are marked as “hit”, that ship is destroyed.
The player who destroys all the opponent’s ships wins the match.
