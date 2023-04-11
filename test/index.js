const request = require('supertest');
const {expect} = require('chai');
const app = require('../app');

describe('Full registration', function () {
  before(function (done) {
    app.listen(function (err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should send back a JSON object with status 200', function (done) {
    request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({ name: 'test_name4', username: 'test_username4', password: 'test_password4' })
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('configurations');
        done();
      });
  });
});


describe('Login', function () {

  before(function (done) {
    app.listen(function (err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should send back a JSON object with status 200', function (done) {
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({ name: 'test_name4', username: 'test_username4', password: 'test_password4' })
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('token');
        done();
      });
  });
});

describe('Login + Creation of configuration + Deletion existence', function () {
    let token;

  before(function (done) {
    app.listen(function (err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('Get the bearer token to use in next calls', function (done) {
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({ name: 'test_name4', username: 'test_username4', password: 'test_password4' })
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  it('Get the created configuration', function (done) {
    request(app)
      .post('/configuration')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: 'TestingService',
        host: 'Localhost',
        port: 3000,
        database_url: 'http://localdb',
        logging_level: 'debug',
      })
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        const { name, host, port, database_url, logging_level } = res.body.result.configurations[0];
        expect(name).to.be.equal('TestingService');
        expect(host).to.be.equal('Localhost');
        expect(port).to.be.equal(3000);
        expect(database_url).to.be.equal('http://localdb');
        expect(logging_level).to.be.equal('debug');
        expect(res.body.result.configurations[0]).to.not.have.property('test');
        done();
      });
  });
  it('Delete the configuration', function (done) {
    request(app)
      .delete('/configuration/TestingService')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        const { configurations } = res.body;
        expect(configurations.length).to.be.equal(0);
        done();
      });
  });
});

describe('Login + Creation of configuration + Update configuration + Get configuration + Deletion', function () {
    let token;

  before(function (done) {
    app.listen(function (err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('Get the bearer token to use in next calls', function (done) {
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({ name: 'test_name4', username: 'test_username4', password: 'test_password4' })
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  it('Get the created configuration', function (done) {
    request(app)
      .post('/configuration')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: 'TestingService',
        host: 'Localhost',
        port: 3000,
        database_url: 'http://localdb',
        logging_level: 'debug',
      })
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        const { name, host, port, database_url, logging_level } = res.body.result.configurations[0];
        expect(name).to.be.equal('TestingService');
        expect(host).to.be.equal('Localhost');
        expect(port).to.be.equal(3000);
        expect(database_url).to.be.equal('http://localdb');
        expect(logging_level).to.be.equal('debug');
        expect(res.body.result.configurations[0]).to.not.have.property('test');
        done();
      });
  });

  it('Update the created configuration', function (done) {
    request(app)
      .patch('/configuration/TestingService')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        host: 'local',
        port: 3002,
        new_key: 'testing',
      })
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('Get the updated configuration', function (done) {
    request(app)
      .get('/configuration/TestingService')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        const { name, host, port, database_url, logging_level } = res.body;
        expect(name).to.be.equal('TestingService');
        expect(host).to.be.equal('local');
        expect(port).to.be.equal(3002);
        expect(database_url).to.be.equal('http://localdb');
        expect(logging_level).to.be.equal('debug');
        expect(res.body).to.have.property('new_key');
        expect(res.body.new_key).to.be.equal('testing');
        done();
      });
  });

  it('Delete the configuration', function (done) {
    request(app)
      .delete('/configuration/TestingService')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        const { configurations } = res.body;
        expect(configurations.length).to.be.equal(0);
        done();
      });
  });
});


describe('Login + Creation of two configuration + Update configuration with the name of the other + Deletion', function () {
    let token;

  before(function (done) {
    app.listen(function (err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('Get the bearer token to use in next calls', function (done) {
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({ name: 'test_name4', username: 'test_username4', password: 'test_password4' })
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  it('Get the 1 created configuration', function (done) {
    request(app)
      .post('/configuration')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: 'TestingService',
        host: 'Localhost',
        port: 3000,
        database_url: 'http://localdb',
        logging_level: 'debug',
      })
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        const { name, host, port, database_url, logging_level } = res.body.result.configurations[0];
        expect(name).to.be.equal('TestingService');
        expect(host).to.be.equal('Localhost');
        expect(port).to.be.equal(3000);
        expect(database_url).to.be.equal('http://localdb');
        expect(logging_level).to.be.equal('debug');
        expect(res.body.result.configurations[0]).to.not.have.property('test');
        done();
      });
  });
  it('Get the 2 created configuration', function (done) {
    request(app)
      .post('/configuration')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: 'TestingService2',
        host: 'Localhost',
        port: 3000,
        database_url: 'http://localdb',
        logging_level: 'debug',
      })
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        const { name, host, port, database_url, logging_level } = res.body.result.configurations[1];
        expect(name).to.be.equal('TestingService2');
        expect(host).to.be.equal('Localhost');
        expect(port).to.be.equal(3000);
        expect(database_url).to.be.equal('http://localdb');
        expect(logging_level).to.be.equal('debug');
        expect(res.body.result.configurations[0]).to.not.have.property('test');
        done();
      });
  });

  it('Update the created configuration', function (done) {
    request(app)
      .patch('/configuration/TestingService')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: 'TestingService2',
        host: 'local',
        port: 3002,
        new_key: 'testing',
      })
      .expect(404, function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body.error.message).to.be.equal('A configuration with the selected name already exists, please choose another name');

        done();
      });
  });


  it('Delete the configuration', function (done) {
    request(app)
      .delete('/configuration/TestingService')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        const { configurations } = res.body;
        expect(configurations.length).to.be.equal(1);
        done();
      });
  });
  it('Delete the configuration', function (done) {
    request(app)
      .delete('/configuration/TestingService2')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        const { configurations } = res.body;
        expect(configurations.length).to.be.equal(0);
        done();
      });
  });
});
