/*
??SuperTest?????
*/
var supertest = require('supertest');
var app = require('../app');

describe('plain text response', function () {

    var request;
    // beforeEach??????describe??????????????
    beforeEach(function () {
        // SuperTest??????
        request = supertest(app)
            // ??“/”??URL
            .get("/")
            // ??User-Agent??
            .set("User-Agent", "my cool browser")
            // ??????????????????
            .set("Accept", "text/plain");
    });

    it('return a plain text response', function (done) {
        request
            .expect("Content-Type", /text\/plain/) // ???????“text/plain”
            .expect(200) // ??HTTP????200
            .end(done); // ??????????done??
    });

    it('return your user Agent', function (done) {
        request
            .expect(function (res) {
                if (res.text !== "my cool browser") {
                    throw new Error("Response does not contain User Agent");
                }
            })
            .end(done); // ??????done
    });
});