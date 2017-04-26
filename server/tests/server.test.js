const expect = require('expect');
const request = require('supertest');

const {
  Todo
} = require('../models/todo');
const {
  app
} = require('../server');

// run below lines of code if you want to remove all todos before running the test
var numberOfDocs = 0;
var aTodo = '';

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

    console.log(`number of docs before test casee 2: ${numberOfDocs}`);

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
  it('should get a Todo by ID ', (done) => {

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        Todo.findOne({
            _id: aTodo._id
          })
          .then((theTodo) => {
            expect(aTodo._id).toEqual(theTodo._id);
          }, (error) => {
            console.log('In error for some reason.\nError:\n', error);
          })
          .catch((error) => {
            return done(error);
          })
      })
      .end((error, res) => {
        if(error) {
          console.log('in error\n', res.body.todos.length);
          console.log('Errrorrrrr:', error);
          done(error)
        } else {
          done();
        }
      })

    // ?\.then((todo) => {}, (err) => {});
  })
});
