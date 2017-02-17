var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user");

// 告诉Passport使用本地策略,身份认证是由本地策略而定的
passport.use("login", new LocalStrategy(function (username, password, done) {
    // 用提供的用户名来查找用户,使用MongoDB查询并获取一个user
    User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        // 如果没有用户提供了用户名，则返回错误消息
        if (!user) {
            return done(null, false, { message: "No user has that username!" });
        }
        // 调用你之前在User模块中定义的checkPassworld方法
        user.checkPassword(password, function (err, isMatch) {
            if (err) { return done(err); }
            if (isMatch) {
                // 如果匹配了则不带错误消息返回当前用户
                return done(null, user);
            } else {
                // 如果没匹配则不带错误消息返回false
                return done(null, false, { message: "Invalid password." });
            }
        });
    });
}));

//告知Passport如何从session中提取用户
module.exports = function () {
    // serializeUser可以将一个user对象转换为ID存入session。
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });
    // deserializeUser可以从session中提取ID转为user对象。
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}