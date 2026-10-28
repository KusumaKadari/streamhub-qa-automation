DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
  transaction_id INTEGER PRIMARY KEY,
  from_account TEXT NOT NULL,
  to_account TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount > 0),
  transaction_time TEXT NOT NULL
);
