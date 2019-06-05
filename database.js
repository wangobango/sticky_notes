import sqlite from 'sqlite3'
const sq = sqlite.verbose()


class DatabaseHelper {
  constructor() {
    this.db = new sq.Database('./database/my_db.db', sq.OPEN_READWRITE, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the on-disk SQlite database.');
    });
  }

  initializeTables() {
    this.db.run(`CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name text UNIQUE NOT NULL
    );`);

    this.db.run(`CREATE TABLE IF NOT EXISTS notes(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title text,
      body text,
      user_id INTEGER NOT NULL,
      time DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );`)
  }

  removeTables() {
    this.db.run('DROP TABLE IF EXISTS users;')
    this.db.run('DROP TABLE IF EXISTS notes;')
  }

  closeDb() {
    this.db.close();
  }

  getUserIdByLogin(login) {
    let sql = `SELECT id FROM users WHERE name = '${login}';`;
    return new Promise((resolve,reject) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        } else {
          resolve(rows[0].id);
        }
      })
    })
  }

  addNewUser(login) {
    let sql = `SELECT name FROM users WHERE name = '${login}';`;
    return new Promise( (resolve, reject) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          // throw err;
        }
        rows.forEach((row) => {
          // console.log(row.name);
        });
  
        if (rows.length == 0) {
          this.db.run(`
            INSERT INTO users(name) VALUES('${login}')
          `);
          resolve();
        } else {
          console.log("User with given login already exists")
        }
      });
    })
  }

  register(login) {
    this.db.run(`
      INSERT into users (name) VALUES(${login});
    `);
  }

  login(login) {
    let sql = `SELECT name FROM users;`;
    this.db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      // console.log(rows)
      rows.forEach((row) => {
        if (row.name == login) {
          return true
        }
      });

      console.log("There is no user with given login");
      return false;
    });
  }

  addNewNote(user_id, title, body) {
    return new Promise( (resolve, reject) => {
      resolve(this.db.run(`
        INSERT INTO notes (title, body, user_id) VALUES('${title}', '${body}', ${parseInt(user_id)});
      `));
      reject('err');
    })
  }

  updateNote(note_id, newTitle, newBody) {
    this.db.run(`
      UPDATE notes SET title = ${newTitle}, body = ${newBody} WHERE id = ${note_id}
    `);
  }

  getAllUserNotes(user_id) {
    const sql = `SELECT * FROM notes WHERE user_id IN(SELECT id FROM users WHERE name = '${user_id}' LIMIT 1) ;`;
    return new Promise((resolve, reject) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        resolve(rows);
      });
    })
  }

  getAllNotes() {
    let sql = `SELECT * FROM notes;`;
    this.db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      console.log(rows);
      return rows;
    });
  }

  removeNoteById(note_id) {
    this.db.run(`
      DELETE FROM notes WHERE id = ${note_id};
    `);
  }

  getAllUsers() {
    let sql = `SELECT * FROM users;`;
    this.db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      console.log(rows);
      return rows;
    });
  }

}

export default DatabaseHelper