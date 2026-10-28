INSERT INTO matches (match_id, match_number, match_date) VALUES
  (1, 1, '2024-03-22'), (2, 2, '2024-03-23'),
  (3, 3, '2024-03-24'), (4, 4, '2024-03-25'),
  (5, 5, '2024-03-26'), (6, 6, '2024-03-27'),
  (7, 7, '2024-03-28'), (8, 8, '2024-03-29'),
  (9, 9, '2024-03-30');

INSERT INTO players (player_id, player_name) VALUES
  (1, 'IPL Qualifier'),
  (2, 'Rohit Example'),
  (3, 'Missing-Game Player'),
  (4, 'Interrupted Player');

INSERT INTO innings_scores VALUES
  -- Three consecutive qualifying innings.
  (1, 1, 35), (1, 2, 42), (1, 3, 31),
  -- Below 30 breaks the streak.
  (2, 1, 30), (2, 2, 28), (2, 3, 34), (2, 4, 36),
  -- No appearance in match 6 breaks the streak; matches 5,7,8 only have two consecutive scores.
  (3, 5, 30), (3, 7, 40), (3, 8, 35),
  -- Two low/interrupting appearances followed by three qualifying appearances.
  (4, 2, 10), (4, 3, 20), (4, 4, 32), (4, 5, 33), (4, 6, 30);
