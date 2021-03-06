const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {User} = require('../models/user');
const {Todo} = require('../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'some text about dudes';

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens.token)
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
         done();
      }).catch((e) => done(e));
    });
  });

  it ('should not create a todo with invalid body data', (done) => {
    const text = "";

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens.token)
    .send(text)
    .expect(418)
    .end((err, res) => {
      if (err) done(err);

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done (e));
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .set('x-auth', users[0].tokens.token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return the todo with the matching id', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens.token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  it('should throw a 406 if given an invalid id', (done) => {
    request(app)
    .get(`/todos/123`)
    .set('x-auth', users[0].tokens.token)
    .expect(406)
    .expect((res) => {
      expect(res.body.todo).toBeFalsy();
    })
    .end(done);
  });
  it('should throw a 404 if given a valid id that is not in the collection', (done) => {
    request(app)
    .get('/todos/9aa9724bffd1a88415fa0a01')
    .set('x-auth', users[0].tokens.token)
    .expect(404)
    .end(done);
  });
  it('should not return a todo created by another user', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens.token)
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should return a 406 if provided an invalid Id', (done) => {
    request(app)
    .delete(`/todos/123`)
    .set('x-auth', users[0].tokens.token)
    .expect(406)
    .end(done);
  });
  it('should remove a todo when passed a correct Id', (done) => {
    const hexId = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens.token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end((err, res) => {
      if (err) return done(err);

      Todo.findById(hexId).then((todo) => {
        expect(todo).toBeFalsy();
        done();
      }).catch((e) => done(e));
    });
  });
  it('should not remove a todo that belongs to someone else', (done) => {
    const hexId = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens.token)
    .expect(404)
    .end(done);
  });
  it('should return a 404 if provided a valid Id that is not there', (done) => {
    request(app)
    .delete(`/todos/5aabd9373ce94d0014a6c45d`)
    .set('x-auth', users[0].tokens.token)
    .expect(404)
    .end(done);
  });
})

describe('PATCH /todos/:id', () => {
  const hexId1 = todos[0]._id.toHexString();
  const hexId2 = todos[1]._id.toHexString();

  const body1 = {
    text: 'updated this thing',
    completed: true,
  };
  const body2 = {
    text: 'updated this thing',
    completed: false,
  };

  it('should update the todo.', (done) => {
    request(app)
    .patch(`/todos/${hexId1}`)
    .set('x-auth', users[0].tokens.token)
    .send(body1)
    .expect(200)
    .end((err, res) => {
      if (err) done(err);

      Todo.findById(hexId1).then((todo) => {
        expect(res.body.todo.text).toBe(body1.text);
        expect(res.body.todo.completed).toBe(body1.completed);
        expect(typeof res.body.todo.completedAt).toBe('number');
        done();
      }).catch((err) => done(err));
    });
  });

  it('should not update a todo that belongs to someone else.', (done) => {
    request(app)
    .patch(`/todos/${hexId1}`)
    .set('x-auth', users[1].tokens.token)
    .send(body1)
    .expect(404)
    .end((err, res) => {
      if (err) done(err);

      Todo.findById(hexId1).then((todo) => {
        expect(res.body.todo).toBeFalsy();
        done();
      }).catch((err) => done(err));
    });
  });

    //update, 200
    //text changed, completed true, completedAt updated
  it('should clear completedAt when completed is set to false.', (done) => {
    request(app)
    .patch(`/todos/${hexId2}`)
    .set('x-auth', users[1].tokens.token)
    .send(body2)
    .expect(200)
    .end((err, res) => {
      if (err) done(err);

      Todo.findById(hexId2).then((todo) => {
        expect(todo.text).toBe(body2.text);
        expect(todo.completed).toBe(body2.completed);
        expect(todo.completedAt).toBeFalsy();
        done();
      }).catch((err) => done(err));
    });
  });

  it('should return 406 with an invalid id.', (done) => {
    request(app)
    .patch(`/todos/123`)
    .set('x-auth', users[0].tokens.token)
    .expect(406)
    .end(done);
  });

  it('should return 404 with a valid id that isn\'t there.', (done) => {
    request(app)
    .patch(`/todos/5aabd9373ce94d0014a6c45f`)
    .set('x-auth', users[0].tokens.token)
    .expect(404)
    .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated.', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens.token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    }).end(done);
  });
  it('should return a 401 if not authenticated.', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    }).end(done);
  });
});

describe('POST users/me', () => {
  it('should create a user.', (done) => {
    const email = 'dude12@gmail.com';
    const password = 'password';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if (err) {
        return done(err);
      }

      User.findOne({email}).then((user) => {
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return validation errors if request is invalid.', (done) => {
    request(app)
    .post('/users')
    .send({email: 'doug', password: 'dudeman2'})
    .expect(400)
    .end(done);
  });

  it('should not create user if email is in use.', (done) => {
    const email = 'dude12@gmail.com';
    const password = 'password';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end(done);
  })
});

describe('POST /users/login', () => {
  it('should login user and return auth token.', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
    })
    .end((err, res) => {
      if (err) return done(err);

      User.findById(users[1]._id).then((user) => {
        expect(user.toObject().tokens[1]).toMatchObject({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e));
    });
  });

  it('should reject invalid login information', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[0].email,
      password: users[0].password + 1
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy();
    })
    .end(done);
  });
});

describe('DELETE /users/me/logout', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/logout')
    .set('x-auth', users[0].tokens.token)
    .expect(200)
    .end((err) => {
      if (err) return done(err);

      User.findById(users[0]._id).then((user) => {
        expect (user.tokens.token).toBeFalsy();
        done();
      }).catch((e) => done(e));
    });
  });
});
