import random
from datetime import datetime, timedelta

import numpy as np
import pandas as pd

num_rows = 100_000
num_cols = 20

continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']
countries = {
    'Africa': ['Nigeria', 'Egypt', 'South Africa'],
    'Asia': ['China', 'India', 'Japan'],
    'Europe': ['Germany', 'France', 'United Kingdom'],
    'North America': ['United States', 'Canada', 'Mexico'],
    'South America': ['Brazil', 'Argentina', 'Chile'],
    'Oceania': ['Australia', 'New Zealand', 'Fiji']
}
states = {
    'United States': ['California', 'Texas', 'New York'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Minas Gerais'],
    'India': ['Maharashtra', 'Delhi', 'Karnataka'],
    'Germany': ['Bavaria', 'Berlin', 'Hamburg'],
    'Australia': ['New South Wales', 'Victoria', 'Queensland'],
}
cities = {
    'California': ['Los Angeles', 'San Francisco', 'San Diego'],
    'São Paulo': ['São Paulo', 'Campinas', 'Santos'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Bavaria': ['Munich', 'Nuremberg', 'Augsburg'],
    'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
}

first_names = ['John', 'Maria', 'Wei', 'Anna', 'Carlos', 'Yuki', 'Fatima', 'Ahmed']
last_names = ['Smith', 'Silva', 'Kumar', 'Müller', 'Garcia', 'Tanaka', 'Ali', 'Nguyen']

def random_string(size=8):
    return ''.join(np.random.choice(list('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), size))

def random_email(first, last):
    domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'example.com']
    return f"{first.lower()}.{last.lower()}{random.randint(1,9999)}@{random.choice(domains)}"

def random_phone():
    return f"+{random.randint(1,99)}-{random.randint(100,999)}-{random.randint(1000,9999)}"

def random_date(start_year=2015, end_year=2024):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    delta = end - start
    random_days = random.randint(0, delta.days)
    return (start + timedelta(days=random_days)).date()

def random_value():
    return round(random.uniform(10, 10000), 2)

data = {
    'continent': [],
    'country': [],
    'state': [],
    'city': [],
    'first_name': [],
    'last_name': [],
    'email': [],
    'phone': [],
    'date': [],
    'value': [],
}

for i in range(1, 11):
    data[f'fake_col_{i}'] = []

for _ in range(num_rows):
    continent = random.choice(continents)
    country = random.choice(countries[continent])
    state = random.choice(states.get(country, ['Unknown']))
    city = random.choice(cities.get(state, ['Unknown']))
    first = random.choice(first_names)
    last = random.choice(last_names)
    email = random_email(first, last)
    phone = random_phone()
    date = random_date()
    value = random_value()
    data['continent'].append(continent)
    data['country'].append(country)
    data['state'].append(state)
    data['city'].append(city)
    data['first_name'].append(first)
    data['last_name'].append(last)
    data['email'].append(email)
    data['phone'].append(phone)
    data['date'].append(date)
    data['value'].append(value)
    for i in range(1, 11):
        data[f'fake_col_{i}'].append(random_string(12))

df = pd.DataFrame(data)

data_dir = r'../frontend/src/assets/data'
import os

os.makedirs(data_dir, exist_ok=True)

json_file = os.path.join(data_dir, 'synthetic_data_large.json')
df.to_json(json_file, orient='records', date_format='iso')

print(f'Arquivo {json_file} gerado com sucesso!')
