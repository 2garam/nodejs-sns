const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { User } = require("../models");

const router = express.Router();

//해당 홈페이지에서 직접 가입, 로그인, 로그아웃 했을 때
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;

    try {
        const exUser = await User.findOne({where:  {email }});
        if(exUser){
            req.flash('joinError', '이미 가입된 이메일입니다.');
            return res.redirect("/join");
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash
        });
        return res.redirect("/");
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError)
        }
        if (!user) {
            req.flash("loginError", info.message);
            return res.redirect("/");
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect("/");
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
});


//kakao로 사용했을 때
router.get("/kakao", passport.authenticate("kakao"));

router.get(
    "/kakao/callback",
    passport.authenticate('kakao', {
    failureRedirect: '/'
}),
    (req, res) => {
        res.redirect("/");
    }
);

module.exports = router;