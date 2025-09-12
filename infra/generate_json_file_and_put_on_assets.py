import json
import os
import random

countries = ['USA', 'Brazil', 'India']
states_by_country = {
    'USA': ['California', 'Texas', 'New York'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Bahia'],
    'India': ['Maharashtra', 'Karnataka', 'Tamil Nadu']
}
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

num_rows = 100_000
num_cols = 20


combinations = [(country, state, month)
                for country in countries
                for state in states_by_country[country]
                for month in months]


repeats = (num_rows // len(combinations)) + 1
all_rows = (combinations * repeats)[:num_rows]

def random_value():
    return random.randint(80, 130)

def random_letter():
    return random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')

def random_string(size=8):
    return ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=size))

data = []
for idx, (country, state, month) in enumerate(all_rows):
    row = {
        'country': country,
        'state': state,
        'month': month,
        'value': random_value(),
        'fake_col_1': random_letter(),
        'fake_col_2': random_letter(),
    }

    for i in range(3, num_cols - 4 + 3):
        row[f'fake_col_{i}'] = random_string(1)
    data.append(row)

data_dir = r'../frontend/src/assets/data'
os.makedirs(data_dir, exist_ok=True)
json_file = os.path.join(data_dir, 'synthetic_data_large.json')
with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False)
print(f'Arquivo {json_file} gerado com sucesso!')
