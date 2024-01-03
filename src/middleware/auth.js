`use strict`

function isAuth(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        req.flash("error", "You are not logged in");
        res.redirect("/auth/login");
    }
}

function isGuest(req, res, next) {
    if (!(req.session.user)) {
        next()
    } else {
        req.flash("error", "You are already logged in");
        res.redirect("/auth/profile");
    }
}

module.exports = {isAuth, isGuest};