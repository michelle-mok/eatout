import express from 'express';
import pg from 'pg';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import jsSHA from 'jssha';

const SALT = 'I love food';

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
const locations = [{ id: 1, name: 'North' }, { id: 2, name: 'East' }, { id: 3, name: 'South' }, { id: 4, name: 'West' }, { id: 5, name: 'Central' }];

const budgets = [{ id: 1, amount: '< $20' }, { id: 2, amount: '< $50' }, { id: 3, amount: '< $100' }, { id: 4, amount: '< $150' }, { id: 5, amount: '> $150' }];

// helper function for getting hashed cookie string
const gettingHashedCookieString = (cookieUserId) => {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  console.log('SALT', SALT);
  shaObj.update(`${cookieUserId}-${SALT}`);
  const hashedCookieString = shaObj.getHash('HEX');
  console.log('hashed cookie string', hashedCookieString);
  return hashedCookieString;
};

// helper function for getting hashed password
const getHashedPassword = (userPassword) => {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  shaObj.update(userPassword);

  const hashedPassword = shaObj.getHash('HEX');
  console.log('hashed password', hashedPassword);
  return hashedPassword;
};

// render a registration form to get user preferences and details
app.get('/register', (req, res) => {
  const { loggedIn } = req.cookies;
  const getCuisineTypes = 'SELECT * FROM cuisines';

  pool.query(getCuisineTypes, (getCuisineTypesError, getCuisineTypesResult) => {
    if (getCuisineTypesError) {
      console.log('error', getCuisineTypesError);
    } else {
      const cuisineTypes = getCuisineTypesResult.rows;
      res.render('register.ejs', { cuisineTypes, loggedIn });
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

  const hashedPassword = getHashedPassword(req.body.password);
  console.log('hashed password:', hashedPassword);

  pool
    .query('INSERT INTO users (first_name, last_name, email, password, phone_number, vegetarian, halal) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [req.body.first_name, req.body.last_name, req.body.email, hashedPassword, req.body.phone_number, req.body.vegetarian, req.body.halal])
    .then((result) => {
      const userId = result.rows[0].id;
      console.log('user id:', userId);
      return userDetails.cuisine.forEach((cuisineId) => {
        pool.query('INSERT INTO user_preferences (user_id, cuisine_id) VALUES ($1, $2)', [userId, cuisineId]);
      });
    })
    .then((result) => {
      console.log('done');
      res.redirect('/login');
    })
    .catch((error) => console.log('error', error));
});

// render a page where the user can add to a friends list from the list of users
app.get('/add', (req, res) => {
  const { loggedIn } = req.cookies;
  const userListQuery = `SELECT * FROM users WHERE id != ${req.cookies.userId}`;
  pool.query(userListQuery, (userListQueryError, userListQueryResult) => {
    if (userListQueryError) {
      console.log('error', userListQueryError);
    } else {
      const friendsList = userListQueryResult.rows;
      res.render('add', { friendsList, loggedIn });
    }
  });
});

// submit data to user_friends table in database
app.post('/add', (req, res) => {
  const friendIds = req.body.id;

  console.log(friendIds);
  const addFriendQuery = 'INSERT INTO user_friends (user_id, friend_id) VALUES ($1, $2)';

  const addFriends = (friendId) => {
    const inputData = [`${Number(req.cookies.userId)}`, Number(friendId)];
    console.log('input data:', inputData);
    pool.query(addFriendQuery, inputData, (addFriendQueryError, addFriendQueryResult) => {
      if (addFriendQueryError) {
        console.log('error', addFriendQueryError);
      }
      return console.log('done');
    });
  };

  if (Array.isArray(friendIds) === false) {
    addFriends(friendIds);
  } else {
    friendIds.forEach((friend) => {
      addFriends(friend);
    });
  }
  res.redirect('/choose');
});

// render a page where the user selects criteria for choosing a restaurant
app.get('/choose', (req, res) => {
  console.log('logged in', req.cookies.loggedIn);
  console.log('userId', req.cookies.userId);
  console.log('req.body.id', req.body.id);
  console.log(req.cookies.loggedInHash);
  console.log(gettingHashedCookieString());

  const { loggedIn } = req.cookies;
  if (req.cookies.loggedInHash !== gettingHashedCookieString()) {
    res.status(403).send('please log in');
  }

  // TODO : change userid when user auth is done
  const getFriendDetails = `SELECT user_friends.friend_id, friends.first_name AS first_name, friends.last_name AS last_name FROM users INNER JOIN user_friends ON users.id = user_friends.user_id INNER JOIN users AS friends ON friends.id = user_friends.friend_id WHERE users.id = ${req.cookies.userId}`;

  pool.query(getFriendDetails, (getFriendDetailsError, getFriendDetailsResult) => {
    if (getFriendDetailsError) {
      console.log('error', getFriendDetailsError);
    } else {
      console.log(getFriendDetailsResult.rows);
      const friendDetailsArray = getFriendDetailsResult.rows;

      console.log('friend details array:', friendDetailsArray);
      res.render('choose', {
        friendDetailsArray, locations, budgets, loggedIn,
      });
    }
  });
});

// submits user info that will be criteria for choosing restauran
app.post('/choose', (req, res) => {
  console.log(req.body);

  const cuisineIds = [];
  const locationId = Number(req.body.location);
  const budgetId = Number(req.body.budget);
  const { userId } = req.cookies;

  const friendIds = req.body.id;
  const friendIdsArray = [];

  // getting array of friend ids
  for (let i = 0; i < friendIds.length; i += 1) {
    if (isNaN(Number(friendIds[i])) == false) {
      friendIdsArray.push(friendIds[i]);
    }
  }

  console.log('friend ids array:', friendIdsArray);
  console.log('friends ids array length:', friendIdsArray.length);

  pool
    .query(`SELECT user_preferences.cuisine_id, users.vegetarian, users.halal
    FROM users
    INNER JOIN user_preferences ON users.id = user_preferences.user_id
    WHERE users.id IN (${friendIdsArray.join(',')})`)
    .then((result) => {
      console.log(result.rows);
      for (let j = 0; j < result.rows.length; j += 1) {
        cuisineIds.push(result.rows[j].cuisine_id);
      }

      console.log('cuisine ids', cuisineIds);
      return pool.query(`SELECT user_preferences.cuisine_id 
    FROM user_preferences 
    INNER JOIN users ON user_preferences.user_id = users.id 
    WHERE users.id = ${userId}`);
    })
    .then((result) => {
      console.log('user cuisine ids:', result.rows);
      const userCuisineIdsArray = [];
      let winningChoices = [];
      let distinctWinningChoices = [];
      for (let i = 0; i < result.rows.length; i += 1) {
        userCuisineIdsArray.push(result.rows[i].cuisine_id);
        console.log('user cuisines id array:', userCuisineIdsArray);
        console.log(i, result.rows.length - 1);
        if (i === result.rows.length - 1) {
          console.log('cuisine ids:', cuisineIds);
          winningChoices = cuisineIds.filter((id) => userCuisineIdsArray.includes(id));
          console.log('winning choices:', winningChoices);
          distinctWinningChoices = [...new Set(winningChoices)];
          console.log('distinct winning vhcoices;', distinctWinningChoices);
        }
      }

      return pool.query(`SELECT DISTINCT restaurants.name, restaurants.address 
          FROM restaurants 
          INNER JOIN user_preferences ON restaurants.cuisine_id = user_preferences.cuisine_id WHERE restaurants.cuisine_id IN (${distinctWinningChoices.join(',')}) AND restaurants.location_id = ${locationId} AND restaurants.budget_id = ${budgetId}`);
    })
    .then((result) => {
      console.log(result.rows);
      const restaurantsArray = result.rows;
      console.log('restaurantsArray:', restaurantsArray);
      console.log('done');
      res.render('results', { restaurantsArray });
    })

    .catch((error) => console.log('error', error));
});

app.get('/edit/:id', (req, res) => {
  const { userId } = req.cookies;
  const { loggedIn } = req.cookies;
  const getUserDetails = 'SELECT * FROM users WHERE ';
});

// user login
app.get('/login', (req, res) => {
  const { loggedIn } = req.cookies;
  res.render('login', { loggedIn });
});

app.post('/login', (req, res) => {
  console.log(req.body);
  console.log('email:', req.body.email);
  pool.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, (error, result) => {
    if (error) {
      console.log('error', error);
      res.status(503).send('something went wrong');
      return;
    }

    console.log(result.rows);
    if (result.rows.length === 0) {
      res.status(403).send('somethings wrong');
      return;
    }

    console.log('password', result.rows[0].password);

    const hashedPassword = getHashedPassword(req.body.password);

    if (hashedPassword === result.rows[0].password) {
      res.cookie('loggedIn', true);
      res.cookie('userId', result.rows[0].id);

      res.cookie('loggedInHash', gettingHashedCookieString(req.body.id));

      res.redirect('/choose');
    } else {
      res.status(403).send('unsuccessful');
    }
  });
});

// user logout
app.delete('/logout', (req, res) => {
  res.clearCookie('loggedInHash');
  res.clearCookie('userId');
  res.clearCookie('loggedIn');
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log('listening on port 3000');
});
