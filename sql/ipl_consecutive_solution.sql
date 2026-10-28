-- SQLite dialect. Start from the complete match schedule crossed with every player.
-- A missing innings row becomes runs = NULL and correctly breaks consecutive matches.
WITH player_schedule AS (
  SELECT m.match_id, m.match_number, m.match_date,
         p.player_id, p.player_name,
         i.runs
  FROM matches AS m
  CROSS JOIN players AS p
  LEFT JOIN innings_scores AS i
    ON i.match_id = m.match_id AND i.player_id = p.player_id
),
scoring_flags AS (
  SELECT *,
         CASE WHEN runs >= 30 THEN 1 ELSE 0 END AS qualifying,
         LAG(runs >= 30) OVER (
           PARTITION BY player_id
           ORDER BY match_number
         ) AS previous_qualifying,
         LAG(match_number) OVER (
           PARTITION BY player_id
           ORDER BY match_number
         ) AS previous_match_number
  FROM player_schedule
),
streak_marks AS (
  SELECT *,
         CASE
           WHEN qualifying = 1
            AND previous_qualifying = 1
            AND previous_match_number = match_number - 1
           THEN 0 ELSE 1
         END AS new_streak
  FROM scoring_flags
),
streaks AS (
  SELECT *,
         SUM(new_streak) OVER (
           PARTITION BY player_id
           ORDER BY match_number
           ROWS UNBOUNDED PRECEDING
         ) AS streak_id
  FROM streak_marks
),
qualifying_streaks AS (
  SELECT player_id, player_name, streak_id,
         MIN(match_date) AS streak_started,
         COUNT(*) AS qualifying_match_count
  FROM streaks
  WHERE qualifying = 1
  GROUP BY player_id, player_name, streak_id
  HAVING COUNT(*) >= 3
)
SELECT player_name, streak_started
FROM qualifying_streaks
ORDER BY streak_started, player_name;
