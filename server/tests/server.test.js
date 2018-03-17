const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'hi mom'
},{
  _id: new ObjectID(),
  text: 'hi mom again',
  completed: true,
  completedAt: 3333333
}];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'some text about dudes';

    request(app)
    .post('/todos')
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
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return the todo with the matching id', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  it('should throw a 406 if given an invalid id', (done) => {
    request(app)
    .get(`/todos/123`)
    .expect(406)
    .expect((res) => {
      expect(res.body.todo).toNotExist();
    })
    .end(done);
  });
  it('should throw a 404 if given a valid id that is not in the collection', (done) => {
    request(app)
    .get('/todos/9aa9724bffd1a88415fa0a01')
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should return a 406 if provided an invalid Id', (done) => {
    request(app)
    .delete(`/todos/123`)
    .expect(406)
    .end(done);
  });
  it('should remove a todo when passed a correct Id', (done) => {
    const hexId = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end((err, res) => {
      if (err) return done(err);

      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((e) => done(e));
    });
  });
  it('should return a 404 if provided a valid Id that is not there', (done) => {
    request(app)
    .delete(`/todos/5aabd9373ce94d0014a6c45d`)
    .expect(404)
    .end(done);
  });
})

describe('UPDATE /todos/:id', () => {
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
    .send(body1)
    .expect(200)
    .end((err, res) => {
      if (err) done(e);

      Todo.findById(hexId1).then((todo) => {
        expect(res.body.todo.text).toBe(body1.text);
        expect(res.body.todo.completed).toBe(body1.completed);
        expect(res.body.todo.completedAt).toBeA('number');
        done();
      }).catch((e) => done(e));
    });
  });

    //update, 200
    //text changed, completed true, completedAt updated
  it('should clear completedAt when completed is set to false.', (done) => {
    request(app)
    .patch(`/todos/${hexId2}`)
    .send(body2)
    .expect(200)
    .end((err, res) => {
      if (err) done(e);

      Todo.findById(hexId2).then((todo) => {
        expect(res.body.todo.text).toBe(body2.text);
        expect(res.body.todo.completed).toBe(body2.completed);
        expect(res.body.todo.completedAt).toNotExist();
        done();
      }).catch((e) => done(e));
    });
  });
  it('should return 406 with an invalid id.', (done) => {
    request(app)
    .delete(`/todos/123`)
    .expect(406)
    .end(done);
  });
  it('should return 404 with a valid id that isn\'t there.', (done) => {
    request(app)
    .delete(`/todos/5aabd9373ce94d0014a6c45d`)
    .expect(404)
    .end(done);
  });
});
