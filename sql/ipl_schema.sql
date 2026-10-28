DROP TABLE IF EXISTS innings_scores;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS matches;

CREATE TABLE matches (
  match_id INTEGER PRIMARY KEY,
  match_number INTEGER NOT NULL UNIQUE,
  match_date TEXT NOT NULL
);

CREATE TABLE players (
  player_id INTEGER PRIMARY KEY,
  player_name TEXT NOT NULL UNIQUE
);

CREATE TABLE innings_scores (
  player_id INTEGER NOT NULL,
  match_id INTEGER NOT NULL,
  runs INTEGER NOT NULL CHECK (runs >= 0),
  PRIMARY KEY (player_id, match_id),
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  FOREIGN KEY (match_id) REFERENCES matches(match_id)
);
