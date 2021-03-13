CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT, 
  password TEXT,
  phone_number BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_friends (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (id),
  friend_id INTEGER REFERENCES users (id),
  added BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cuisines (
  id SERIAL PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (id),
  cuisine_id INTEGER REFERENCES cuisines (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name TEXT, 
  cuisine_id INTEGER REFERENCES cuisines (id),
  budget_id INTEGER,
  location_id INTEGER,
  address TEXT,
  phone_number BIGINT,
  photo TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

