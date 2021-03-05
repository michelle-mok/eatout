insert into users (first_name, last_name, email, password, phone_number, vegetarian, halal) values ('Padget', 'Besset', 'pbesset0@smh.com.au', 'xkCYDp9y', 45678932, 'yes', 'no');
insert into users (first_name, last_name, email, password, phone_number, vegetarian, halal) values ('De witt', 'Swayland', 'dswayland1@earthlink.net', 'jxRFSnX8', 56943267, 'no', 'yes');
insert into users (first_name, last_name, email, password, phone_number, vegetarian, halal) values ('Aaren', 'Casiero', 'acasiero2@omniture.com', 'jWR6rqQwPoI',45780543, 'yes', 'no');
insert into users (first_name, last_name, email, password, phone_number, vegetarian, halal) values ('Antonella', 'Pinckney', 'apinckney3@issuu.com', 'RCle4gy9iNi', 34780213, 'no', 'yes');
insert into users (first_name, last_name, email, password, phone_number, vegetarian, halal) values ('Jayson', 'Lulham', 'jlulham4@youtu.be', 'PjUTFt5m', 59032156, 'yes', 'yes');
insert into users (first_name, last_name, email, password, phone_number, vegetarian, halal) values ('Neron', 'Lanyon', 'nlanyon5@comsenz.com', 'HLJFtKgT',56098732, 'no', 'no');
insert into users (first_name, last_name, email, password, phone_number, vegetarian, halal) values ('Yorke', 'Joskowitz', 'yjoskowitz6@businessinsider.com', 'EWo5M6nnG5', 56921345, 'no', 'yes');
insert into users (first_name, last_name, email, password, phone_number, vegetarian, halal) values ('Harlene', 'Greatex', 'hgreatex7@hhs.gov', 'JxmNvE', 67984021, 'yes', 'no');
insert into users (first_name, last_name, email, password, phone_number, vegetarian, halal) values ('Kati', 'Ewles', 'kewles8@senate.gov', 'zYeuCLNIEe', 45687021, 'no', 'yes');
insert into users (first_name, last_name, email, password, phone_number, vegetarian, halal) values ('Jarid', 'Gorgler', 'jgorgler9@vinaora.com', '05RYU9', 56780321, 'no', 'no');









INSERT INTO user_friends (user_id, friend_id) VALUES (1, 3);
INSERT INTO user_friends (user_id, friend_id) VALUES (1, 5);
INSERT INTO user_friends (user_id, friend_id) VALUES (1, 2);
INSERT INTO user_friends (user_id, friend_id) VALUES (1, 7);
INSERT INTO user_friends (user_id, friend_id) VALUES (2, 1);
INSERT INTO user_friends (user_id, friend_id) VALUES (2, 3);
INSERT INTO user_friends (user_id, friend_id) VALUES (2, 6);
INSERT INTO user_friends (user_id, friend_id) VALUES (3, 1);
INSERT INTO user_friends (user_id, friend_id) VALUES (3, 2);
INSERT INTO user_friends (user_id, friend_id) VALUES (3, 4);



INSERT INTO user_preferences (user_id, cuisine_id) VALUES (1, 12);
INSERT INTO user_preferences (user_id, cuisine_id) VALUES (1, 8);
INSERT INTO user_preferences (user_id, cuisine_id) VALUES (1, 5);
INSERT INTO user_preferences (user_id, cuisine_id) VALUES (2, 5);
INSERT INTO user_preferences (user_id, cuisine_id) VALUES (2, 8);
INSERT INTO user_preferences (user_id, cuisine_id) VALUES (3, 3);
INSERT INTO user_preferences (user_id, cuisine_id) VALUES (3, 5);
INSERT INTO user_preferences (user_id, cuisine_id) VALUES (3, 8);


INSERT INTO cuisines (name) VALUES ('Japanese');
INSERT INTO cuisines (name) VALUES ('Korean');
INSERT INTO cuisines (name) VALUES ('Malay');
INSERT INTO cuisines (name) VALUES ('Mexican');
INSERT INTO cuisines (name) VALUES ('Northern Indian');
INSERT INTO cuisines (name) VALUES ('Greek');
INSERT INTO cuisines (name) VALUES ('Chinese');
INSERT INTO cuisines (name) VALUES ('Spanish');
INSERT INTO cuisines (name) VALUES ('German');
INSERT INTO cuisines (name) VALUES ('Western');
INSERT INTO cuisines (name) VALUES ('Peranakan');
INSERT INTO cuisines (name) VALUES ('Indonesian');
INSERT INTO cuisines (name) VALUES ('Italian');
INSERT INTO cuisines (name) VALUES ('French');
INSERT INTO cuisines (name) VALUES ('Indian');
INSERT INTO cuisines (name) VALUES ('Thai');

INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('La Tapería', 8, 4, 3, '1 Scotts Rd, #02 - 10 / 11, Singapore 228208', 67378336, '/lataperia.jpg', 'https://www.lataperia.com.sg/' );
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('Esquina', 8, 5, 3, '16 Jiak Chuan Rd, Singapore 089267', 62221616,'/esquina.jpg', 'https://esquina.com.sg/');
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('My Little Spanish Place ', 8, 3, 4, ' 619 Bukit Timah Rd, Singapore 269720', 64632810, '/mylittlespanishplace.jpg', 'http://www.mylittlespanishplace.com.sg/');
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('Tapas Club', 8, 2, 2, '78 Airport Blvd., #03 - 220 / 221 / 222, Singapore 819666', 66028081, 'https://www.tapasclub.com/');
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('Himawari Japanese Restaurant', 1, 2, 1, '1 Orchid Club Rd #02-02/03, Driving Range unit (Carpark, A Orchid Country Club, 769162', 68343313, '/himawari.jpg', 'https://www.himawari.com.sg/');
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('Kaiyo Sushi and Grill', 1, 1, 2, '13 Teck Chye Terrace, Singapore 545724', 69519203,'/kaiyo.jpg', 'https://www.facebook.com/kaiyosushigrill/');
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('SUSHI TEI', 1, 2, 1, '930 Yishun Ave 2 #02-15, Northpoint City, 769098', 62572822,'/sushitei.jpg', 'https://sushitei.com/');
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('The Japanese Food Alley', 1, 1, 3, '73A Ayer Rajah Crescent, Singapore 139957', 92994877,'/jpnfoodalley.jpeg', 'https://www.facebook.com/thejapanesefoodalley/');
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('Hakata Japanese Restaurant @ NeWest', 1, 2, 4, '1 W Coast Dr, #01-93/70 NEWest, Singapore 128020', 62654680, '/hakata.jpeg', 'https://www.hakatarestaurant.com/' );
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('The Boiler', 10, 3, 5, '50 Novena Court', 65990321);
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('Bali Thai', 16, 4, 4, '29 Clementi South', 67890321);
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('Auntie Pat', 11, 3, 2, '11 Bugis Junction', 56896791);
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('Korean Family Restaurant', 2, 4, 3, '54 Ann Siang Hill', 56890321);
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('Jade Garden', 7, 5, 3, '62 Sentosa Cove', 65100321);
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('The Boneless Kitchen', 2, 1, 1, '50 Marsiling Avenue', 1296321);
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('My Spanish Place', 8, 3, 1, '50 Bukit Timah', 78010321);
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('My Spanish Place', 8, 3, 1, '50 Bukit Timah', 56856011);
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('My Spanish Place', 8, 3, 1, '50 Bukit Timah', 67032121);

INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address, phone_number, photo, website) VALUES ('My Spanish Place', 8, 3, 1, '50 Bukit Timah', 67032121);





