//????HTML????test / html.js??
var app = require("../app");
var supertest = require("supertest");
//Cheerio?Node??jQuery
var cheerio = require('cheerio');

describe("html response", function () {
    var request;
    beforeEach(function () {
        // ???beforeEach????????????????text/plain????text/html
        request = supertest(app)
            .get("/")
            .set("User-Agent", "a cool browser")
            .set("Accept", "text/html");
    });
    it("returns an HTML response", function(done){
        request
            .expect("Content-Type", /html/)
            .expect(200)
            .end(done);
    });
    it("returns your User Agent", function(done){
       request
            .expect(function (res) {
                var htmlResponse = res.text;
                // ???HTML?????Cheerio??
                var $ = cheerio.load(htmlResponse);
                // ?HTML???User Agent
                var userAgent = $(".user-agent").html().trim();
                // ??????User Agent????
                if (userAgent !== "a cool browser") {
                    throw new Error("User Agent not found");
                }
            })
            .end(done);
    });
});