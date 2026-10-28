import sqlite3
from pathlib import Path

base = Path(__file__).resolve().parent
conn = sqlite3.connect(':memory:')


def execute_sql_file(filename):
    conn.executescript((base / filename).read_text(encoding='utf-8'))


def query(filename):
    sql = (base / filename).read_text(encoding='utf-8')
    cursor = conn.execute(sql)
    names = [description[0] for description in cursor.description]
    rows = cursor.fetchall()
    return names, rows


def write_result(section, names, rows):
    lines = [section, '| ' + ' | '.join(names) + ' |', '| ' + ' | '.join(['---'] * len(names)) + ' |']
    for row in rows:
        lines.append('| ' + ' | '.join(str(value) for value in row) + ' |')
    lines.append(f'\nRows returned: {len(rows)}')
    return '\n'.join(lines)

execute_sql_file('round_trip_schema.sql')
execute_sql_file('round_trip_data.sql')
round_names, round_rows = query('round_trip_solution.sql')

execute_sql_file('ipl_schema.sql')
execute_sql_file('ipl_data.sql')
ipl_names, ipl_rows = query('ipl_consecutive_solution.sql')

output = '# SQL Challenge Verification Results\n\n'
output += 'Engine: Python built-in SQLite 3, execution mode: in-memory.\n\n'
output += write_result('## Challenge 1: Round-trip transactions', round_names, round_rows) + '\n\n'
output += write_result('## Challenge 2: IPL 2024 consecutive scoring streaks', ipl_names, ipl_rows) + '\n'

(base.parent / 'test-results' / 'sql-verification.md').parent.mkdir(parents=True, exist_ok=True)
(base.parent / 'test-results' / 'sql-verification.md').write_text(output, encoding='utf-8')
print(output)
