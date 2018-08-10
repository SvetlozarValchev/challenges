import * as request from 'supertest';
import app from './app';

app.start();

describe('GET /CreateExportJob', function () {
    const api = '/api/CreateExportJob';

    it('deny invalid bookId type', function (done) {
        request(app.express)
            .post(api)
            .send({
                bookId: 123,
                type: 'pdf'
            })
            .expect(200, {
                status: 'fail',
                data: {
                    errors: [
                        "instance.bookId is not of a type(s) string"
                    ]
                }
            }, done);
    });

    it('deny missing bookId', function (done) {
        request(app.express)
            .post(api)
            .send({
                type: 'pdf'
            })
            .expect(200, {
                status: 'fail',
                data: {
                    errors: [
                        "instance requires property \"bookId\""
                    ]
                }
            }, done);
    });

    it('deny missing type', function (done) {
        request(app.express)
            .post(api)
            .send({
                bookId: 'aaa'
            })
            .expect(200, {
                status: 'fail',
                data: {
                    errors: [
                        "instance requires property \"type\""
                    ]
                }
            }, done);
    });

    it('deny invalid type', function (done) {
        request(app.express)
            .post(api)
            .send({
                bookId: 'abc123',
                type: 'exe'
            })
            .expect(200, {
                status: 'fail',
                data: {
                    errors: [
                        "instance.type is not one of enum values: epub,pdf"
                    ]
                }
            }, done);
    });

    it('accept valid request', function (done) {
        request(app.express)
            .post(api)
            .send({
                bookId: 'abc123',
                type: 'pdf'
            })
            .expect(200, {
                status: 'success',
                data: null
            }, done);
    });
});

describe('GET /CreateImportJob', function () {
    const api = '/api/CreateImportJob';

    it('deny invalid bookId type', function (done) {
        request(app.express)
            .post(api)
            .send({
                bookId: 1,
                type: 'pdf',
                url: 'www.example.com'
            })
            .expect(200, {
                status: 'fail',
                data: {
                    errors: [
                        "instance.bookId is not of a type(s) string"
                    ]
                }
            }, done);
    });

    it('deny missing bookId', function (done) {
        request(app.express)
            .post(api)
            .send({
                type: 'pdf',
                url: 'www.example.com'
            })
            .expect(200, {
                status: 'fail',
                data: {
                    errors: [
                        "instance requires property \"bookId\""
                    ]
                }
            }, done);
    });
    //
    it('deny invalid type', function (done) {
        request(app.express)
            .post(api)
            .send({
                bookId: 'abc123',
                type: 'exe',
                url: 'www.example.com'
            })
            .expect(200, {
                status: 'fail',
                data: {
                    errors: [
                        "instance.type is not one of enum values: word,pdf,wattpad,evernote"
                    ]
                }
            }, done);
    });

    it('deny missing url', function (done) {
        request(app.express)
            .post(api)
            .send({
                bookId: 'abc123',
                type: 'pdf'
            })
            .expect(200, {
                status: 'fail',
                data: {
                    errors: [
                        "instance requires property \"url\""
                    ]
                }
            }, done);
    });
    //
    it('accept valid request', function (done) {
        request(app.express)
            .post(api)
            .send({
                bookId: 'abc123',
                type: 'pdf',
                url: 'www.example.com'
            })
            .expect(200, {
                status: 'success',
                data: null
            }, done);
    });
});

describe('GET /ListImportJobs', function () {
    const testData = {
        bookId: 'abc123',
        type: 'pdf',
        url: 'www.example.com'
    };

    it('Lists import jobs', function (done) {
        app.clearJobs();

        request(app.express)
            .post('/api/CreateImportJob')
            .send(testData)
            .expect(200)
            .end((err) => {
                if (err) return done(err);

                request(app.express)
                    .get('/api/ListImportJobs')
                    .expect(200, {
                        status: 'success',
                        data: {
                            pending: [
                                testData
                            ]
                        }
                    }, done);
            })
    });
});

describe('GET /ListExportJobs', function () {
    const testData = {
        bookId: 'abc123',
        type: 'pdf',
    };

    it('Lists export jobs', function (done) {
        app.clearJobs();

        request(app.express)
            .post('/api/CreateExportJob')
            .send(testData)
            .expect(200)
            .end((err) => {
                if (err) return done(err);

                request(app.express)
                    .get('/api/ListExportJobs')
                    .expect(200, {
                        status: 'success',
                        data: {
                            pending: [
                                testData
                            ]
                        }
                    }, done);
            })
    });
});
