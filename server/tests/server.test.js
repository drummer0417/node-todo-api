const expect = require('expect');
const request = require('supertest');

const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { app } = require('../server');

// run below lines of code if you want to remove all todos before running the test
var numberOfDocs = 0;
var aTodo = undefined;
var aUser = undefined;

beforeEach((done) => {
  Todo.find({}).then((todos) => {
    numberOfDocs = todos.length;
    aTodo = todos[0];
    done();
  }, (err) => {
    numberOfDocs - 1;
    done();
  });
})

// and another beforreEach here
beforeEach((done) => {
  User.find({}).then((users) => {
    aUser = users[0];
    done();
  }, (errro) => {
    done();
  })
})

describe('/POST/todos', () => {

  it('Should send a request and return status 200', (done) => {

    var text = 'My very first ToDo 11';

    request(app)
      .post('/todos')
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toEqual(text);
      })
      .end((error, res) => {
        if(error) {
          console.error('Errortje', error);
          return done(error);
        }
        // find all todos
        Todo.find({
            '_id': res.body._id
          }).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toEqual(text);
            return done();
          })
          .catch((error) => {
            console.log('in catch tak van promise');
            done(error);
          });
      });
  });

  it('should send a "Bad" request and return status 400', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((error, res) => {
        if(error) {
          console.error('Errortje', error);
          return done(error);
        }
        Todo.find({}).then((todos) => {
            expect(todos.length).toBe(numberOfDocs);
            return done();
          })
          .catch((error) => {
            return done(error);
          });
      });
  });
});

describe('GET /todos', () => {
  //
  it('Should get a Todo by ID ', (done) => {

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(numberOfDocs);
      })
      .end(done);

  })
});

describe('Get /todos/id', () => {

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
      .get(`/todos/${aTodo._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toEqual(aTodo.text);
        expect(res.body.todo._id).toEqual(aTodo._id);
      })
      .end(done);
  })

});

describe('DELETE /todos/:id', () => {

  it('Should delete the to todo with the given ID', (done) => {

    var hexID = aTodo._id.toHexString();

    request(app)
      .delete(`/todos/${hexID }`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toEqual(hexID);
      })
      .end((err, res) => {
        if(err) {
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

  it('Should return 404 because an invalid id is entered passed', (done) => {
    request(app)
      .delete('todos/123')
      .expect(404)
      .end(done);
  });
});
