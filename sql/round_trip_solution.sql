-- SQLite dialect. For each account pair, require a sender-to-other pair,
-- then a reverse transfer occurring later within 24 hours. Account-name
-- ordering prevents reporting the same A/B pair twice.
SELECT
  first_tx.transaction_id AS first_transaction_id,
  first_tx.from_account AS first_sender,
  first_tx.to_account AS first_receiver,
  first_tx.amount AS first_amount,
  first_tx.transaction_time AS first_timestamp,
  return_tx.transaction_id AS return_transaction_id,
  return_tx.from_account AS return_sender,
  return_tx.to_account AS return_receiver,
  return_tx.amount AS return_amount,
  return_tx.transaction_time AS return_timestamp
FROM transactions AS first_tx
JOIN transactions AS return_tx
  ON first_tx.from_account = return_tx.to_account
 AND first_tx.to_account = return_tx.from_account
WHERE first_tx.from_account < first_tx.to_account
  AND return_tx.transaction_time > first_tx.transaction_time
  AND datetime(return_tx.transaction_time) <= datetime(first_tx.transaction_time, '+24 hours')
  AND ABS(first_tx.amount - return_tx.amount) <= 0.10 * MAX(first_tx.amount, return_tx.amount)
  AND first_tx.from_account <> first_tx.to_account
ORDER BY datetime(first_tx.transaction_time), first_tx.transaction_id, return_tx.transaction_id;
