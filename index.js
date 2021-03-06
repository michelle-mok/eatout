import express from 'express';
import pg from 'pg';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import jsSHA from 'jssha';

const { Pool } = pg;

let pgConnectionConfigs;
if (process.env.DATABASE_URL) {
  // pg will take in the entire value and use it to connect
  pgConnectionConfigs = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  pgConnectionConfigs = {
    user: 'michellemok',
    host: 'localhost',
    database: 'eatout',
    port: 5432,
  };
}

const pool = new Pool(pgConnectionConfigs);

const app = express();
const PORT = process.env.PORT || 3004;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// arrays providing locations and budgets (global variable)
const locations = [{ id: 1, name: 'North' }, { id: 2, name: 'East' }, { id: 3, name: 'South' }, { id: 4, name: 'West' }];

const budgets = [{ id: 1, amount: '< $20' }, { id: 2, amount: '$20 - $50' }, { id: 3, amount: '$50 - $100' }, { id: 4, amount: '$100 - $150' }];

// helper function for getting number of friend requests
const getNumberOfFriendRequests = (userId) => {
  let count;
  pool.query(`SELECT COUNT(*) FROM user_friends WHERE friend_id = ${userId} AND added = false`, (error, result) => {
    if (error) {
      console.log('error', error);
    } else {
      count = result.rows[0].count;
      console.log('count', count);
    }
    return count;
  });
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
  // loggedIn === false as user is not yet logged in. Navbar shows log in instead of logout button
  const { loggedIn } = req.cookies;
  const { count } = req.cookies;

  // renders a list of cuisines for the user to select from
  const getCuisineTypes = 'SELECT * FROM cuisines';

  pool.query(getCuisineTypes, (getCuisineTypesError, getCuisineTypesResult) => {
    if (getCuisineTypesError) {
      console.log('error', getCuisineTypesError);
    } else {
      const cuisineTypes = getCuisineTypesResult.rows;

      res.render('register', { cuisineTypes, loggedIn, count });
    }
  });
});

// submit user preference data to user_preferences table in database and user details to users table
app.post('/register', (req, res) => {
  const userDetails = req.body;
  console.log('user details:', userDetails);

  // hash user's password
  const hashedPassword = getHashedPassword(req.body.password);
  console.log('hashed password:', hashedPassword);

  // format user's phone number so that the number can be used to send a whatsapp message
  const formattedPhoneNumber = `65${req.body.phone_number}`;
  console.log('format phone', formattedPhoneNumber);

  let userId;

  pool
    .query('INSERT INTO users (first_name, last_name, email, password, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING id', [req.body.first_name, req.body.last_name, req.body.email, hashedPassword, formattedPhoneNumber])
    .then((result) => {
      userId = result.rows[0].id;
      console.log('user id:', userId);
      return userDetails.cuisine.forEach((cuisineId) => {
        pool.query('INSERT INTO user_preferences (user_id, cuisine_id) VALUES ($1, $2)', [userId, cuisineId]);
      });
    })
    .then((result) => {
      console.log('done');

      // log user in after registration
      res.cookie('loggedIn', true);
      res.cookie('userId', userId);

      // takes user to page where friends are added
      res.redirect('/add');
    })
    .catch((error) => console.log('error', error));
});

// user login, renders the login page
app.get('/', (req, res) => {
  const { loggedIn } = req.cookies;
  const { count } = req.cookies;

  res.render('login', { loggedIn, count });
});

// submit info on login form to log user in
app.post('/', (req, res) => {
  console.log(req.body);
  console.log('email:', req.body.email);
  pool.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, (error, result) => {
    if (error) {
      console.log('error', error);
      res.status(503).send('something went wrong');
      return;
    }

    console.log(result.rows);

    // situation where email address doesn't exist in the database
    if (result.rows.length === 0) {
      res.status(403).send('somethings wrong');
      return;
    }

    console.log('password', result.rows[0].password);

    // hash password so that it can be compared to password in the database
    const hashedPassword = getHashedPassword(req.body.password);

    // checking hashed password against hashed password in the database, if identical, the user is logged in
    if (hashedPassword === result.rows[0].password) {
      res.cookie('loggedIn', true);
      res.cookie('userId', result.rows[0].id);

      pool.query(`SELECT COUNT(DISTINCT user_id) FROM user_friends WHERE added = false AND friend_id = ${result.rows[0].id};`, (sumError, sumResult) => {
        if (sumError) {
          console.log('error', error);
        } else {
          const { count } = sumResult.rows[0];
          console.log('number of friend requests', count);
          res.cookie('count', count);
          res.redirect('/choose');
        }
      });
    } else {
      res.status(403).send('unsuccessful');
    }
  });
});

// render a page where the user can add to a friends list from the list of users
app.get('/add', (req, res) => {
  const { loggedIn } = req.cookies;
  const { count } = req.cookies;

  const userIdListArray = [];
  const friendListArray = [];
  let displayList = [];

  if (!loggedIn) {
    res.redirect('/');
    return;
  }

  pool
    // get all users besides current user
    .query(`SELECT id FROM users WHERE id != ${req.cookies.userId}`)
    .then((result) => {
      result.rows.forEach((element) => {
        userIdListArray.push(element.id);
      });
      // get users that are already in current user's friend list
      return pool.query(`SELECT friend_id FROM user_friends WHERE user_id = ${req.cookies.userId}`);
    })
    .then((result) => {
      result.rows.forEach((friend) => {
        friendListArray.push(friend.friend_id);
        console.log('friend list:', friendListArray);
      });

      displayList = userIdListArray.filter((id) => !friendListArray.includes(id));
      console.log('display list', displayList);

      // if all contacts are already on friend's list, user is redirected
      if (displayList.length < 1) {
        res.redirect('/choose');
      }

      return pool.query(`SELECT * FROM users WHERE id IN (${displayList.join(',')})`);
    })
    .then((result) => {
      const contactDetails = result.rows;
      res.render('add', { loggedIn, contactDetails, count });
    })
    .catch((error) => console.log('error', error));
});

// submit data to user_friends table in database
app.post('/add', (req, res) => {
  const friendIds = req.body.id;

  console.log(friendIds);
  const addFriendQuery = 'INSERT INTO user_friends (user_id, friend_id, added) VALUES ($1, $2, $3)';

  const addFriends = (friendId) => {
    // before friend request is accepted, added is set to false
    const inputData = [`${Number(req.cookies.userId)}`, Number(friendId), false];
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
    res.cookie('count', getNumberOfFriendRequests());
  } else {
    friendIds.forEach((friend) => {
      addFriends(friend);
    });
    res.cookie('count', getNumberOfFriendRequests());
  }

  res.redirect('/choose');
});

// render a page where friend requests can be seen
app.get('/notifications', (req, res) => {
  const { loggedIn } = req.cookies;
  const { count } = req.cookies;

  const friendRequestIds = [];

  pool
    .query(`SELECT user_id FROM user_friends WHERE friend_id = ${req.cookies.userId} AND added = false`)
    .then((result) => {
      console.log('user ids who have friend requests', result.rows);
      result.rows.forEach((friend) => {
        friendRequestIds.push(friend.user_id);
      });

      if (friendRequestIds.length === 0) {
        res.render('no-friend-request', { loggedIn, count });
        return;
      }

      return pool.query(`SELECT first_name, last_name, email, id FROM users WHERE id IN (${friendRequestIds.join(',')})`);
    })
    .then((result) => {
      console.log('details of users who have sent friend requests', result.rows);
      const requestDetails = result.rows;
      res.render('notifications', { loggedIn, requestDetails, count });
    })
    .catch((error) => console.log(error));
});

// submits friend ids that have been approved, updates user_friends table
app.post('/notifications', (req, res) => {
  let approvedIds;
  let approveRequest;
  console.log(req.body.id);
  

  if (Array.isArray(req.body.id)) {
    approvedIds = req.body.id;
    console.log('approved ids array', approvedIds);
    // added column in user_friends is set to true when the friend request is approved
    approveRequest = `UPDATE user_friends SET added = true WHERE user_id IN (${approvedIds.join(',')}) AND friend_id = ${req.cookies.userId} RETURNING *`;
  } else {
    approvedIds = [];
    approvedIds.push(req.body.id);
    console.log('single id', approvedIds);
    console.log(approvedIds[0]);
    approveRequest = `UPDATE user_friends SET added = true WHERE user_id = ${approvedIds[0]} AND friend_id = ${req.cookies.userId} RETURNING *`;
  }

  approvedIds.forEach((id) => {
  pool.query(`INSERT INTO user_friends (user_id, friend_id, added) VALUES ($1, $2, $3) RETURNING *`, [req.cookies.userId, id, true], (error, result) => {
    if (error) {
      console.log('error', error);
    }

    console.log('friends added', result.rows);
    })
  })

  pool
  .query(approveRequest)
  .then((result) => {
    console.log('updated details', result.rows);
    return pool.query(`SELECT COUNT(*) FROM user_friends WHERE friend_id = ${req.cookies.userId} AND added = false`)
  })
  .then((result) => {
    console.log('count', result.rows[0].count);
    const numFriendRequests = result.rows[0].count;
    console.log('friend request count', numFriendRequests);

    res.cookie('count', numFriendRequests);
    res.redirect('/choose');
  })
  .catch((error) => console.log('error', error));
});

// render a form to delete friends from friends list
app.get('/delete', (req, res) => {
  const { loggedIn } = req.cookies;
  const { count } = req.cookies;

  if (!loggedIn) {
    res.redirect('/');
    return;
  }

  pool
    .query(`SELECT friend_id FROM user_friends WHERE user_id = ${req.cookies.userId}`)
    .then((result) => {
      console.log(result.rows);
      const friendsIds = [];
      result.rows.forEach((friend) => {
        friendsIds.push(friend.friend_id);
      });
      console.log('friend ids:', friendsIds);
      return pool.query(`SELECT * FROM users WHERE id IN (${friendsIds.join(',')})`);
    })
    .then((result) => {
      const friendsDetails = result.rows;
      console.log(friendsDetails);
      res.render('delete', { friendsDetails, loggedIn, count });
    })
    .catch((error) => (console.log('error', error)));
});

// delete friends from friend list
app.delete('/delete/:id', (req, res) => {
  const friendId = req.params.id;
  pool.query(`DELETE FROM user_friends WHERE user_id = ${req.cookies.userId} AND friend_id = ${friendId} RETURNING *`, (error, result) => {
    if (error) {
      console.log('error', error);
    } else {
      console.log(result.rows);
      res.redirect('/delete');
    }
  });
});

// render a page where the user selects criteria for choosing a restaurant
app.get('/choose', (req, res) => {
  console.log('logged in', req.cookies.loggedIn);
  console.log('userId', req.cookies.userId);
  console.log('req.body.id', req.body.id);

  const { loggedIn } = req.cookies;
  const { count } = req.cookies;

  if (!loggedIn) {
    res.redirect('/');
    return;
  }

  const getFriendDetails = `SELECT user_friends.friend_id, friends.first_name AS first_name, friends.last_name AS last_name FROM users INNER JOIN user_friends ON users.id = user_friends.user_id INNER JOIN users AS friends ON friends.id = user_friends.friend_id WHERE users.id = ${req.cookies.userId} AND user_friends.added = true`;

  pool.query(getFriendDetails, (getFriendDetailsError, getFriendDetailsResult) => {
    if (getFriendDetailsError) {
      console.log('error', getFriendDetailsError);
    } else {
      console.log(getFriendDetailsResult.rows);
      const friendDetailsArray = getFriendDetailsResult.rows;

      console.log('friend details array:', friendDetailsArray);
      res.render('choose', {
        friendDetailsArray, locations, budgets, loggedIn, count,
      });
    }
  });
});

// submits user info that will be criteria for choosing restaurant
app.post('/choose', (req, res) => {
  console.log(req.body);

  const cuisineIds = [];
  let restaurantsArray = [];
  let chosenRestaurant;
  const locationId = Number(req.body.location);
  const budgetId = Number(req.body.budget);
  const { userId } = req.cookies;
  const { loggedIn } = req.cookies;
  const { count } = req.cookies;

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
  // get an array of friends cuisine preferences
    .query(`SELECT user_preferences.cuisine_id
    FROM users
    INNER JOIN user_preferences ON users.id = user_preferences.user_id
    WHERE users.id IN (${friendIdsArray.join(',')})`)
    .then((result) => {
      console.log(result.rows);
      for (let j = 0; j < result.rows.length; j += 1) {
        cuisineIds.push(result.rows[j].cuisine_id);
      }

      console.log('cuisine ids', cuisineIds);
      // get an array of user's cuisine preferences
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
          // get an array of all cusine ids that both user and user friend have
          winningChoices = cuisineIds.filter((id) => userCuisineIdsArray.includes(id));
          console.log('winning choices:', winningChoices);
          // no repeats in the array
          distinctWinningChoices = [...new Set(winningChoices)];
          console.log('distinct winning vhcoices;', distinctWinningChoices);
        }
      }

      console.log(locationId);
      console.log(budgetId);
      console.log(distinctWinningChoices.join(','));
      return pool.query(`SELECT DISTINCT restaurants.name, restaurants.address, restaurants.photo, restaurants.phone_number, restaurants.website
          FROM restaurants 
          INNER JOIN user_preferences ON restaurants.cuisine_id = user_preferences.cuisine_id WHERE restaurants.cuisine_id IN (${distinctWinningChoices.join(',')}) AND restaurants.location_id = ${locationId} AND restaurants.budget_id = ${budgetId}`);
    })
    .then((result) => {
      console.log(result.rows);
      restaurantsArray = result.rows;
      console.log('restaurantsArray:', restaurantsArray);
      console.log('done');

      // if there are no suitable restaurants found
      if (!restaurantsArray || restaurantsArray.length === 0) {
        res.render('no-results', { loggedIn, count });
        return;
      }

      if (restaurantsArray.length === 1) {
        chosenRestaurant = restaurantsArray[0];
        console.log('chosen restaurant', chosenRestaurant);

      }
      // display one restaurant for the user
      if (restaurantsArray.length > 1) {
        const randomNumber = Math.floor(Math.random * (restaurantsArray.length));
        chosenRestaurant = restaurantsArray[randomNumber];
        console.log('chosen restaurant', chosenRestaurant);

      }

      return pool.query(`SELECT phone_number, first_name FROM users WHERE id IN (${friendIdsArray.join(',')})`);
    })
    .then((result) => {
      const friendPhoneNumbers = result.rows;
      console.log(friendPhoneNumbers);
      res.render('results', {
        chosenRestaurant, loggedIn, friendPhoneNumbers, count,
      });
    })
    .catch((error) => console.log('error', error));
});

// renders a form that allows users to edit their information
app.get('/edit', (req, res) => {
  const { userId } = req.cookies;
  const { loggedIn } = req.cookies;
  const { count } = req.cookies;

  if (!loggedIn) {
    res.redirect('/');
    return;
  }

  const userCuisineIds = [];
  let userDetails;
  const userCuisineNames = [];

  pool
    .query(`SELECT * FROM users WHERE id = ${userId}`)
    .then((result) => {
      userDetails = result.rows[0];
      console.log('user details', userDetails);
      return pool.query(`SELECT cuisine_id FROM user_preferences WHERE user_id = ${userId}`);
    })
    .then((result) => {
      console.log('cuisine ids', result.rows);
      result.rows.forEach((element) => {
        userCuisineIds.push(element.cuisine_id);
      });

      console.log('cuisine ids', userCuisineIds);
      return pool.query(`SELECT name FROM cuisines WHERE id IN (${userCuisineIds.join(',')})`);
    })
    .then((result) => {
      result.rows.forEach((element) => {
        userCuisineNames.push(element.name);
      });
      console.log('user cuisine names:', userCuisineNames);
      return pool.query('SELECT name FROM cuisines');
    })
    .then((result) => {
      console.log('cuisine names', result.rows);
      const allCuisinesNames = [];
      result.rows.forEach((element) => {
        allCuisinesNames.push(element.name);
      });
      console.log('all cuisines names', allCuisinesNames);
      console.log('user details', userDetails);
      res.render('edit', {
        userCuisineNames, loggedIn, userDetails, allCuisinesNames, count,
      });
    })
    .catch((error) => console.log('error', error));
});

// submits changed user information to the database
app.put('/edit', (req, res) => {
  const id = req.cookies.userId;

  console.log('updated info:', req.body);
  const editUserDetails = `UPDATE users SET first_name = '${req.body.first_name}', last_name = '${req.body.last_name}', email = '${req.body.email}', phone_number = ${Number(req.body.phone_number)} WHERE id = ${id} RETURNING *`;

  pool.query(editUserDetails, (editUserDetailsError, editUserDetailsResult) => {
    if (editUserDetailsError) {
      console.log('error', editUserDetailsError);
    } else {
      console.log('new details', editUserDetailsResult.rows);
    }
  });

  pool.query(`DELETE FROM user_preferences WHERE user_id = ${id} RETURNING *`, (deleteError, deleteResult) => {
    if (deleteError) {
      console.log('error', deleteError);
    } else {
      console.log(deleteResult.rows);

      const cuisineNames = req.body.cuisine_name;

      for (let i = 0; i < cuisineNames.length; i += 1) {
        pool.query(`SELECT id FROM cuisines WHERE name = '${cuisineNames[i]}'`, (error, result) => {
          if (error) {
            console.log('error', error);
          } else {
            console.log('cuisine id:', result.rows);
            const cuisineId = result.rows[0].id;
            console.log(cuisineId);

            pool.query('INSERT INTO user_preferences (user_id, cuisine_id) VALUES ($1, $2)', [id, cuisineId], (insertError, insertResult) => {
              if (insertError) {
                console.log('error', error);
              } else {
                console.log('done');
                if (i === cuisineNames.length - 1) {
                  res.redirect('/choose');
                }
              }
            });
          }
        });
      }
    }
  });
});

// user logout
app.delete('/logout', (req, res) => {
  res.clearCookie('loggedInHash');
  res.clearCookie('userId');
  res.clearCookie('loggedIn');
  res.clearCookie('count');
  res.redirect('/');
});

app.listen(PORT);
