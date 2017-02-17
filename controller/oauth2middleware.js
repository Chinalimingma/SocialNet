'use strict';

var _ = require('underscore');
var crispy = require('crispy-string');

const DEFAULT_EXPIRATION_TIME = 3600; // seconds (1 hour)
const TOKEN_LENGTH = 20;

//memory objects for storing the tokens
var validTokens = {};
var refreshTokens = {};

function generateToken() {
    return crispy.base32String(TOKEN_LENGTH);
}

function issueAuthorization(username, callback) {
    var accessToken = generateToken();
    var refreshToken = generateToken();
    var token = {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: DEFAULT_EXPIRATION_TIME,
        refresh_token: refreshToken
    };

    saveValidToken(token, username);
    callback(token);
}

function saveValidToken(token, username) {
    var tokenCopy = _.clone(token);
    tokenCopy.username = username;

    //store the tokens in hash tables memory objects
    validTokens[token.access_token] = tokenCopy;
    refreshTokens[token.refresh_token] = tokenCopy;

    //removed validTokens after the TTL (Time to live) expires
    setTimeout(function () {
        expireToken(tokenCopy.access_token);
    }, DEFAULT_EXPIRATION_TIME * 1000);
}

function expireToken(token) {
    delete validTokens[token];
}

function authorize(data, callback) {
    var grantType = data.grant_type;
    var username = data.username;
    var password = data.password;

    //if the grant type is not supported, then we should
    //respond with an invalid_grant error
    if (grantType !== 'password') {
        return callback({ error: 'invalid_grant' });
    }

    //if a parameter is missing in the request,
    //then we should respond with an invalid_request error
    if (!username || !password) {
        return callback({ error: 'invalid_request' });
    }

    if (username === 'john' && password === 'doe') {
        issueAuthorization(username, callback);
    } else {
        callback({ error: 'invalid_grant' });
    }
}

function authenticate(token, callback) {
    if (_.has(validTokens, token)) {
        callback({ valid: true, token: validTokens[token] });
    } else {
        callback({ valid: false, token: null });
    }
}

module.exports = {
    authenticate(req, res) {
        authorize(req.body || {}, _.bind(res.json, res));
    },

    //
    requireAuthorization(req, res, next) {
        var authorization = req.headers.authorization || '';

        if (!authorization) {
            return res.sendStatus(401);
        }

        var splitValues = authorization.split(' ');
        var tokenType = splitValues[0];
        var token = splitValues[1];

        if (!tokenType || tokenType !== 'Bearer' || !token) {
            return res.sendStatus(401);
        }

        authenticate(token, function (response) {
            if (response.valid) {
                next();
            } else {
                return res.sendStatus(401);
            }
        });
    }
};
