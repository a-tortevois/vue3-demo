import random
from datetime import datetime

DATA_SOURCE = "source.txt"
DATA_OUTPUT = "output.txt"

LOCATION = [
    ('Belgium', 'Brussels'),
    ('Germany', 'Berlin'),
    ('Germany', 'Hamburg'),
    ('Germany', 'Munich'),
    ('Ireland', 'Dublin'),
    ('France', 'Bordeaux'),
    ('France', 'Paris'),
    ('France', 'Lyon'),
    ('France', 'Nice'),
    ('The Netherlands', 'Amsterdam'),
    ('United Kingdom', 'Edinburgh'),
    ('United Kingdom', 'London'),
]

JOBS = [
    ('Systems Architect', 'System', 65000, 80000),
    ('Systems Administrator', 'System', 65000, 80000),
    ('Support Lead', 'Support', 50000, 75000),
    ('Support Engineer', 'Support', 40000, 50000),
    ('Support Technician', 'Support', 35000, 40000),
    ('Development Team Leader', 'Engineering', 60000, 75000),
    ('Senior Javascript Developer', 'Engineering', 50000, 60000),
    ('Javascript Developer', 'Engineering', 40000, 50000),
    ('Junior Javascript Developer', 'Engineering', 35000, 45000),
]


class Person:
    def __init__(self, id, gender, first_name, last_name, birth_date):
        self.id = id
        self.gender = gender
        self.first_name = first_name
        self.last_name = last_name
        self.birth_date = birth_date
        self.start_date = None
        self.office = None
        self.country = None
        self.job_title = None
        self.department = None
        self.salary = None
        self.complete_fields()

    def generate_start_date(self):
        dt_birth_date = datetime.fromisoformat(self.birth_date)
        dt_start_date_min = int(datetime.timestamp(dt_birth_date) + (23 * 365 * 24 * 3600))
        dt_start_date_max = int(datetime.timestamp(datetime.fromisoformat('2023-01-30')))
        ts_start_date = random.randint(dt_start_date_min, dt_start_date_max)
        dt_start_date = datetime.fromtimestamp(ts_start_date)
        return dt_start_date.strftime("%Y-%m-%d")

    def complete_fields(self):
        self.start_date = self.generate_start_date()
        self.country, self.office = random.choice(LOCATION)
        self.job_title, self.department, salary_min, salary_max = random.choice(JOBS)
        self.salary = random.randint(salary_min, salary_max)


def load_data(file):
    data = []
    with open(file, 'r') as f:
        for line in f.readlines():
            if len(line.strip().split(';')) != 5:
                print(f'skip {line}')
                continue
            id, gender, first_name, last_name, birth_date = line.strip().split(';')
            birth_date = datetime.strptime(birth_date, '%d/%m/%Y').strftime("%Y-%m-%d")
            data.append(Person(id, gender, first_name, last_name, birth_date))
    return data


def save_data(data, file):
    with open(file, 'w') as f:
        for p in data:
            f.write(f'{p.id};{p.gender};{p.first_name};{p.last_name};{p.birth_date};{p.start_date};{p.country};{p.office};{p.department};{p.job_title};{p.salary}\n')
    f.close()


def main():
    data = load_data(DATA_SOURCE)
    save_data(data, DATA_OUTPUT)


if __name__ == '__main__':
    main()
