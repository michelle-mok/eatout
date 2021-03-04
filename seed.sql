insert into users (first_name, last_name, email, password, vegetarian, halal) values ('Padget', 'Besset', 'pbesset0@smh.com.au', 'xkCYDp9y', 'yes', 'no');
insert into users (first_name, last_name, email, password, vegetarian, halal) values ('De witt', 'Swayland', 'dswayland1@earthlink.net', 'jxRFSnX8', 'no', 'yes');
insert into users (first_name, last_name, email, password, vegetarian, halal) values ('Aaren', 'Casiero', 'acasiero2@omniture.com', 'jWR6rqQwPoI', 'yes', 'no');
insert into users (first_name, last_name, email, password, vegetarian, halal) values ('Antonella', 'Pinckney', 'apinckney3@issuu.com', 'RCle4gy9iNi', 'no', 'yes');
insert into users (first_name, last_name, email, password, vegetarian, halal) values ('Jayson', 'Lulham', 'jlulham4@youtu.be', 'PjUTFt5m', 'yes', 'yes');
insert into users (first_name, last_name, email, password, vegetarian, halal) values ('Neron', 'Lanyon', 'nlanyon5@comsenz.com', 'HLJFtKgT', 'no', 'no');
insert into users (first_name, last_name, email, password, vegetarian, halal) values ('Yorke', 'Joskowitz', 'yjoskowitz6@businessinsider.com', 'EWo5M6nnG5', 'no', 'yes');
insert into users (first_name, last_name, email, password, vegetarian, halal) values ('Harlene', 'Greatex', 'hgreatex7@hhs.gov', 'JxmNvE', 'yes', 'no');
insert into users (first_name, last_name, email, password, vegetarian, halal) values ('Kati', 'Ewles', 'kewles8@senate.gov', 'zYeuCLNIEe', 'no', 'yes');
insert into users (first_name, last_name, email, password, vegetarian, halal) values ('Jarid', 'Gorgler', 'jgorgler9@vinaora.com', '05RYU9', 'no', 'no');




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


INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address) VALUES ('My Spanish Place', 8, 3, 1, '50 Bukit Timah');
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address) VALUES ('Himalayan Kitchen', 5, 2, 1, '20 MacPherson Road');
INSERT INTO restaurants (name, cuisine_id, budget_id, location_id, address) VALUES ('Spanish Unlimited', 8, 2, 2, '62 Woodlands Drive');





