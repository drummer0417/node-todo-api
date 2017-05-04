const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { app } = require('../server');
const { populateTodos, populateUsers, todosArray, usersArray } = require('./seed/seed');


// beforeEach((done) => {
before(populateTodos);
before(populateUsers);

describe('/POST/todos', () => {

  it('Should send a request and return status 200', (done) => {

    var text = 'Todo added by test case 1';
    var id = new ObjectID();

    request(app)
      .post('/todos')
      .send({ _id: id, text })
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toEqual(id);
        expect(res.body.text).toEqual(text);
      })
      .end(done);
  });

  it('should send a "Bad" request and return status 400', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end(done);
  });
});

describe('GET /todos', () => {
  //
  it('Should get all todos ', (done) => {

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(5);
      })
      .end(done);

  })
});

describe('GET /todos/:id', () => {

  it('Should pass in an invalid id and return a 404', (done) => {

    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  })

  it('Should pass in nonexitant id and return 404', (done) => {

    request(app)
      .get('/todos/58fe0cfe741ebb383a9f3712')
      .expect(404)
      .end(done);
  })

  it('Should pass in a validId and return 200 and a user object', (done) => {

    request(app)
      .get(`/todos/${todosArray[0]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toEqual(todosArray[0]._id);
        expect(res.body.todo.text).toEqual(todosArray[0].text);
      })
      .end(done);
  })

});

describe('DELETE /todos/:id', () => {

  it('Should delete the to todo with the given ID', (done) => {

    var hexID = todosArray[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID }`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toEqual(hexID);
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        Todo.findById(hexID)
          .then((theDeletedTodo) => {
            expect(theDeletedTodo).toNotExist();
            done();
          })
          .catch((error) => done(error))
      });
  });

  it('Should return 404 as the todo with given id does not exist', (done) => {
    request(app)
      .delete(`/todos/58ffb3132b381333605a1ba9`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 because an invalid id is passed', (done) => {

    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  })
});

describe('PATCH /todos/:id', () => {

  it('Should updata a todo to compleded and set completedAt', (done) => {
    request(app)
      .patch(`/todos/${todosArray[1]._id}`)
      .send({ "text": "this todo is completed now :-)", "completed": true })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('Should update a todo to completed is false and reset completedAt', (done) => {
    var newText = 'This todo is updated to completed is false';

    request(app)
      .patch(`/todos/${todosArray[2]._id}`)
      .send({ "text": newText, "completed": false })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toEqual(newText);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });

  it('Should return 404 because an invalid id is passed', (done) => {

    request(app)
      .patch('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('GET /users/me', () => {

  it('Should get a valid user and authenticate return 200', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', usersArray[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        // console.log('Response: ', res.body);
        expect(res.body._id).toEqual(
          usersArray[0]._id);
        expect(res.body.email).toEqual(usersArray[0].email);
      })
      .end(done)
  });

  it('Should return 401, Token is valid but user is not found', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', usersArray[2].tokens[0].token)
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done)
  });

  it('Should return 401 User found but token does not match', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', usersArray[0].tokens[0].token + 'a')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done)
  })
});

describe('POST /users', () => {
  console.log('User: ', usersArray[2]);
  it('Should create a user', (done) => {
    request(app)
      .post('/users')
      .send(usersArray[2])
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body.user).toExist();
        expect(res.body.user.email).toEqual(usersArray[2].email);
      })
      .end(done);
  });

  it('Should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send(usersArray[3])
      .expect(400)
      .expect((res) => {
        expect(res.error).toExist();
        expect(res.error.text).toMatch(/passwor/);
      })
      .end(done);
  });

  it('Should return error if user email address already in use', (done) => {
    request(app)
      .post('/users')
      .send(usersArray[0])
      .expect(400)
      .expect((res) => {
        expect(res.error).toExist();
        expect(res.error.text).toMatch(/duplicate key/);
      })
      .end(done);
  });

});

describe('Post /users/login', () => {

  it('Should login a user and return a token', (done) => {
    request(app)
      .post('/users/login')
      .send({ 'email': usersArray[0].email, 'password': usersArray[0].password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end(done);
  })

  it('Should return 401 if user does not exist', (done) => {
    request(app)
      .post('/users/login')
      .send({ 'email': 'unknownuser@now.nl', 'password': usersArray[0].password })
      .expect(401)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
        expect(res.body).toEqual({});
      })
      .end(done);
  })
  it('Should return 401 if user exists but password is invalid', (done) => {
    request(app)
      .post('/users/login')
      .send({ 'email': usersArray[0].email, 'password': 'theWrongPassword@#$' })
      .expect(401)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
        expect(res.body).toEqual({});
      })
      .end(done);
  })

})
