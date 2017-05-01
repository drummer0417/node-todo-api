const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { app } = require('../server');

// run below lines of code if you want to remove all todos before running the test

var todosArray = [
  { _id: new ObjectID(), text: "The first todo", completed: false },
  { _id: new ObjectID(), text: "The second todo", completed: false },
  { _id: new ObjectID(), text: "The 3rd todo", completed: true },
  { _id: new ObjectID(), text: "The last todo", completed: true }
];

// beforeEach((done) => {
before((done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todosArray);

    }).then(() => {
      done();
    });
});

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
