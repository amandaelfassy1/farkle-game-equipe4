"use strict";

const express = require("express");
// const helmet = require('helmet')

const bodyParser = require("body-parser");
const urlencoderParser = bodyParser.urlencoded({ extended: false });
const { User } = require("./models");
const { Op } = require("sequelize");
const { APP_PORT } = process.env;

const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
// const port = 3000

const { emailRegex, usernameRegex, passwordRegex } = require("./helpers/regex");

const { render } = require("pug");
const { urlencoded } = require("body-parser");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// app.use(helmet())
app.use(express.static("public"));
app.use(urlencoderParser);
app.set("view engine", "./views");

app.use(
  session({
    secret: "unephrasetressecrete",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({
        where: { username },
      });
      if (!user) {
        return done(null, false, {
          success: false,
          message: "Compte introuvable",
        });
      } else if (user.password !== password) {
        return done(null, false, {
          success: false,
          message: "Mot de passe incorrect",
        });
      }
      return done(null, user);
    } catch (error) {
      return done(null, false, { message: "Une erreur est survenue" });
    }
  })
);
app.get("/", (req, res) => {
  res.render("index.pug", { user: req.user });
});

app.get("/signup", (req, res) => {
  res.render("signup.pug");
});
app.post("/signup", urlencoderParser, async (req, res) => {
  try {
    const { email, password, username } = req.body;
    //verifier si email fourni dans req.body a une syntaxe valide
    if (!email.match(emailRegex)) {
      //retourner signup.pug avec les données déja tapées
      return res.status(400).render("signup.pug", {
        alert: {
          success: false,
          danger: true,
          message: "Email invalide",
        },
        previous: req.body,
      });
    }
    if (!password.match(passwordRegex)) {
      //retourner signup.pug avec les données déja tapées
      return res.status(400).render("signup.pug", {
        alert: {
          success: false,
          danger: true,
          message: "password invalide",
        },
        previous: req.body,
      });
    }
    const [user, created] = await User.findOrCreate({
      where: { [Op.or]: [{ username }, { email }] },
      defaults: {
        username,
        email,
        password,
        isAdmin: false,
      },
    });
    if (!created) {
      //avertir l'utilisateur que son email ou username est deja utilisé
      return res.status(400).render("signup.pug", {
        alert: {
          success: false,
          danger: true,
          message: "L'email ou le nom sont déjà utilisés",
        },
        previous: req.body,
      });
    }
    // console.log('POST/signup -> utilisateur créé', user)
    res.status(200).render("signup.pug", {
      alert: {
        success: true,
        danger: false,
        message: "Bravo vous etes inscrit",
      },
      previous: req.body,
    });
  } catch (error) {
    console.log("erreur dans POST/signup ->", error);
    res.status(500).render("500.pug");
  }
});

app.get("/signin", (req, res) => {
  res.render("signin.pug");
});
app.get("/signout", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.post("/signin", urlencoderParser, function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.render("signin.pug", {
        alert: {
          success: false,
          danger: true,
          message: "Une erreur est survenue",
        },
      });
    }
    if (!user) {
      return res.render("signin.pug", {
        alert: {
          success: false,
          danger: true,
          message: info.message,
        },
      });
    }

    req.logIn(user, function (err) {
      if (err) {
        return res.render("/signin", {
          alert: {
            success: false,
            danger: true,
            message: "Une erreur est survenue",
          },
        });
      }
      return res.redirect("/game/");
    });
  })(req, res, next);
});

app.get("/admin", async (req, res) => {
  if (!req.user) return res.redirect("/");
  if (!req.user.isAdmin) return res.redirect("/");
  try {
    const users = await User.findAll();
    // console.log('users ->', users)
    res.render("admin.pug", { users: users, user: req.user });
  } catch (error) {
    console.error(error);
  }
});
app.get("/admin/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findByPk(userId);
  if (!user) return res.render("404.pug");
  //verifier que userId = user.id ou req.user.isAdmin === true
});

app.get("/game", (req, res) => {
  if (!req.user) return res.redirect("/");
  const { username } = req.user;
  res.render("game.pug", {
    user: req.user,
    username,
  });
});

app.get("/edit", (req, res) => {
  if (!req.user) return res.redirect("/");
  res.render("edit.pug", { user: req.user, edit: req.user });
});

app.get("/user", (req, res) => {
  res.render("user.pug");
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (!req.user) return res.redirect("/");
  res.render("edit.pug", { user: req.user, edit: user });
});

app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin === "1";

  const user = await User.findByPk(id);
  if (!req.user) return res.redirect("/");
  //verifier si email fourni dans req.body a une syntaxe valide
  if (!email.match(emailRegex)) {
    //retourner signup.pug avec les données déja tapées
    return res.status(400).render("edit.pug", {
      alert: {
        success: false,
        danger: true,
        message: "Email invalide",
      },
      previous: req.body,
      user: req.user,
      edit: user,
    });
  }
  if (!password.match(passwordRegex)) {
    //retourner signup.pug avec les données déja tapées
    return res.status(400).render("edit.pug", {
      alert: {
        success: false,
        danger: true,
        message: "password invalide",
      },
      previous: req.body,
      user: req.user,
      edit: user,
    });
  }
  if (!username.match(usernameRegex)) {
    //retourner signup.pug avec les données déja tapées
    return res.status(400).render("edit.pug", {
      alert: {
        success: false,
        danger: true,
        message: "username invalide",
      },
      previous: req.body,
      user: req.user,
      edit: user,
    });
  }
  await User.update(
    { username: username, email: email, password: password, isAdmin: isAdmin },
    {
      where: {
        id: id,
      },
    }
  );
  return res.render("edit.pug", {
    alert: {
      success: true,
      danger: false,
      message: "Le profil a bien été modifié",
    },
    user: req.user,
    edit: { ...req.body, id: id, isAdmin: isAdmin },
  });
});

app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await User.destroy({
      where: {
        id: id,
      },
    });
    // res.redirect('/admin')
    if (req.user.id == id) {
      res.redirect("/signout");
    } else {
      if (req.user.isAdmin) {
        res.redirect("/admin");
      } else {
        res.redirect("/signout");
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error server");
  }
});

app.get("*", (req, res) => {
  res.status(404).render("404.pug");
});

io.on("connection", (socket) => {
  const username = socket.request._query["username"];
  socket.emit("game", {
    from: "Serveur",
    message: `Bienvenue sur le game ${username} ! `,
  });

  socket.broadcast.emit("game", {
    from: "Serveur",
    message: `${username} a rejoint le game`,
  });

  socket.on("game", (data) => {
    const { from, message } = data;
    socket.broadcast.emit("game", { from, message });
    socket.emit("game", { from, message });
    console.log(data);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("game", {
      from: "Serveur",
      message: `${username} a quitté le game `,
    });
  });
});

http.listen(APP_PORT || 3000, () =>
  console.log(`le serveur express est lancé sur le port ${APP_PORT || 3000}`)
);
