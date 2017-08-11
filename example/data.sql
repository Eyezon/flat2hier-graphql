INSERT INTO 
    cars 
    ( id, name, license_no, added_at )
VALUES
    (1, 'Toyota CKV', 'WB 211 3221', '2010-09-09'),
    (2, 'Tata Seadan Old', 'WB 232 1321', '2010-08-09'),
    (3, 'Tata Nano', 'MP 555 4444', '2016-09-09'),
    (4, 'Opera Mini', 'WB 234 5431', '2019-10-09'),
    (5, 'WV Nero', 'WB 211 3111', '2013-02-07');

INSERT INTO 
    drivers
    ( id, first_name, last_name, license_no, vehicle_type, expires_on, added_at )
VALUES
    ( 1, 'Ramu', 'Mallick', 'XK47-12912', 'A', '2022-07-08', '2016-09-09' ),
    ( 2, 'Ratan', 'Basu', 'BK48-12917', 'AA', '2022-07-08', '2016-09-09' ),
    ( 3, 'Raktim', 'Bot', 'CK47-12912', 'A', '2022-07-08', '2016-09-09' ),
    ( 4, 'Adipriya', 'Hun', 'DK47-12912', 'A', '2022-07-08', '2016-09-09' ),
    ( 5, 'Panchagram', 'Nagarik', 'AK47-12912', 'A', '2022-07-08', '2016-09-09' ),
    ( 6, 'Ramu', 'Mallick', 'FK47-12912', 'A', '2022-07-08', '2016-09-09' );

INSERT INTO
    assigned_cars
    ( car_id, driver_id, assigned_at )
VALUES
    (1, 1, '2017-06-06'),
    (2, 1, '2017-07-06'),
    (2, 5, '2017-06-06'),
    (3, 1, '2017-06-06'),
    (4, 3, '2017-06-06'),
    (5, 6, '2017-06-06');
