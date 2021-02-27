import express from 'express';
import pg from 'pg';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import jsSHA from 'jssha';

const { Pool } = pg;

const pool = new Pool({
  user: 'michellemok',
  host: 'localhost',
  database: 'eatout',
  port: 5432,
});

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// arrays providing locations and budgets (global variable)
const locations = [{ id: 1, name: 'Mandai' }, { id: 2, name: 'Yishun' }];

const budgets = [{ id: 1, amount: '< $10' }, { id: 2, amount: '< $20' }, { id: 3, amount: '< $50' }];

// render a registration form to get user preferences and details
app.get('/register', (req, res) => {
  const getCuisineTypes = 'SELECT * FROM cuisines';

  pool.query(getCuisineTypes, (getCuisineTypesError, getCuisineTypesResult) => {
    if (getCuisineTypesError) {
      console.log('error', getCuisineTypesError);
    } else {
      const cuisineTypes = getCuisineTypesResult.rows;
      res.render('register.ejs', { cuisineTypes });
    }
  });
});

// submit user preference data to user_preferences table in database and user details to users table
app.post('/register', (req, res) => {
  // toggle button used for vegetarian and halal columns
  if (!req.body.vegetarian) {
    req.body.vegetarian = 'no';
  }

  if (!req.body.halal) {
    req.body.halal = 'no';
  }

  const userDetails = req.body;
  console.log('user details:', userDetails);

  pool
    .query('INSERT INTO users (first_name, last_name, email, password, vegetarian, halal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [`${req.body.first_name}`, `${req.body.last_name}`, `${req.body.email}`, `${req.body.password}`, `${req.body.vegetarian}`, `${req.body.halal}`])
    .then((result) => {
      const userId = result.rows[0].id;
      console.log('user id:', userId);
      return userDetails.cuisine.forEach((cuisineId) => {
        pool.query('INSERT INTO user_preferences (user_id, cuisine_id) VALUES ($1, $2)', [userId, cuisineId]);
      });
    })
    .then((result) => {
      console.log('done');
      res.send('done');
    })
    .catch((error) => console.log('error', error));
});

// render a page where the user can add to a friends list from the list of users
app.get('/add', (req, res) => {
  // TODO : get userid after adding user auth
  const userListQuery = 'SELECT * FROM users WHERE id != 1';
  pool.query(userListQuery, (userListQueryError, userListQueryResult) => {
    if (userListQueryError) {
      console.log('error', userListQueryError);
    } else {
      const friendsList = userListQueryResult.rows;
      res.render('add', { friendsList });
    }
  });
});

// submit data to user_friends table in database
app.post('/add', (req, res) => {
  const friendIdArray = req.body.id;

  console.log(friendIdArray);
  const addFriendQuery = 'INSERT INTO user_friends (user_id, friend_id) VALUES ($1, $2)';

  friendIdArray.forEach((friendId) => {
    const inputData = [1, Number(friendId)];
    console.log('input data:', inputData);
    pool.query(addFriendQuery, inputData, (addFriendQueryError, addFriendQueryResult) => {
      if (addFriendQueryError) {
        console.log('error', addFriendQueryError);
      } else {
        console.log('done');
      }
    });
  });
  res.send('done');
});

// render a page where the user selects criteria for choosing a restaurant
app.get('/choose', (req, res) => {
  // TODO : change userid when user auth is done

  const getFriendIds = 'SELECT friend_id AS id FROM user_friends WHERE user_id = 1';

  pool.query(getFriendIds, (getFriendIdsError, getFriendIdsResult) => {
    if (getFriendIdsError) {
      console.log(getFriendIdsError);
    } else {
      console.log(getFriendIdsResult.rows);
      const friendIds = getFriendIdsResult.rows;

      const friendDetailsArray = [];
      friendIds.forEach((friend) => {
        const getFriendDetails = `SELECT first_name, last_name, id FROM users where id = ${friend.id}`;

        pool.query(getFriendDetails, (getFriendDetailsError, getFriendDetailsResult) => {
          if (getFriendDetailsError) {
            console.log('error', getFriendDetailsError);
          } else {
            console.log(getFriendDetailsResult.rows);
            const friendDetails = getFriendDetailsResult.rows[0];
            friendDetailsArray.push(friendDetails);
            if (friendDetailsArray.length === friendIds.length) {
              console.log('check array lengths', friendDetailsArray.length, friendIds.length);
              res.render('choose', { friendDetailsArray, locations, budgets });
            }
          }
        });
      });
    }
  });
});

// submits user info that will be criteria for choosing restaurant
app.post('/choose', (req, res) => {
  console.log(req.body);
  const friendIds = req.body.id;
  for (let i = 0; i < friendIds.length; i += 1) {
    if (isNaN(Number(friendIds[i])) == false) {
      const friendPreferences = `SELECT user_preferences.cuisine_id, users.vegetarian, users.halal FROM users INNER JOIN user_preferences ON users.id = user_preferences.user_id WHERE users.id = ${friendIds[i]} `;

      pool.query(friendPreferences, (friendPreferencesError, friendPreferencesResult) => {
        if (friendPreferencesError) {
          console.log('error', friendPreferencesError);
        } else {
          console.log(friendPreferencesResult.rows);
        }
      });
    }
  }
  res.send('done');
});

app.listen(PORT, () => {
  console.log('listening on port 3000');
});
