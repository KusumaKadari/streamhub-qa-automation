# SQL Challenge Verification Results

Engine: Python built-in SQLite 3, execution mode: in-memory.

## Challenge 1: Round-trip transactions
| first_transaction_id | first_sender | first_receiver | first_amount | first_timestamp | return_transaction_id | return_sender | return_receiver | return_amount | return_timestamp |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | A | B | 100.0 | 2024-05-01 09:00:00 | 2 | B | A | 95.0 | 2024-05-01 11:30:00 |
| 3 | A | C | 500.0 | 2024-05-01 12:00:00 | 4 | C | A | 450.0 | 2024-05-01 13:00:00 |

Rows returned: 2

## Challenge 2: IPL 2024 consecutive scoring streaks
| player_name | streak_started |
| --- | --- |
| IPL Qualifier | 2024-03-22 |
| Interrupted Player | 2024-03-25 |

Rows returned: 2
