INSERT INTO transactions (transaction_id, from_account, to_account, amount, transaction_time) VALUES
  (1, 'A', 'B', 100.00, '2024-05-01 09:00:00'),
  (2, 'B', 'A', 95.00,  '2024-05-01 11:30:00'),  -- Qualifies: reverse and within 10%
  (3, 'A', 'C', 500.00, '2024-05-01 12:00:00'),
  (4, 'C', 'A', 450.00, '2024-05-01 13:00:00'),  -- Qualifies: exactly 10% below 500
  (5, 'X', 'Y', 200.00, '2024-05-02 08:00:00'),
  (6, 'Y', 'X', 250.00, '2024-05-02 09:00:00'),  -- Does not qualify: 25% different
  (7, 'M', 'N', 300.00, '2024-05-03 08:00:00'),
  (8, 'N', 'M', 295.00, '2024-05-04 10:00:01'), -- Does not qualify: more than 24 hours
  (9, 'A', 'A', 999.00, '2024-05-04 12:00:00'); -- Self-transfer excluded
