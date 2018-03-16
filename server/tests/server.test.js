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
  text: 'hi mom again'
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
    request(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  it('should return a 404 if provided a valid Id that is not there', (done) => {
    request(app)
    .delete(`/todos/5aabd9373ce94d0014a6c45d`)
    .expect(404)
    .end(done);
  });
})
