const bcrypt = require('bcryptjs');
const db = require('./config/db');

const username = 'admin';
const plainPassword = 'admin123';
const user_type = 'admin';
const image = 'profile.jpg';

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.log('Error hashing password:', err);
    return;
  }

  const query = 'INSERT INTO users (username, password, user_type, image) VALUES (?, ?, ?, ?)';
  db.query(query, [username, hash, user_type, image], (error, results) => {
    if (error) {
      console.log('Error inserting user:', error);
    } else {
      console.log('User inserted successfully!');
    }
  });
});
