CREATE TABLE cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(55) NOT NULL,
    license_no VARCHAR(160) NOT NULL UNIQUE,
    added_at TIMESTAMP NOT NULL
);

CREATE TABLE drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(55) NOT NULL,
    last_name VARCHAR(55) NOT NULL,
    license_no VARCHAR(160) NOT NULL UNIQUE,
    vehicle_type VARCHAR(200),
    expires_on DATE,
    added_at TIMESTAMP NOT NULL
);

CREATE TABLE assigned_cars (
    car_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    assigned_at TIMESTAMP
)
