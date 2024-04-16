import express from "express";

import { auth } from "./auth/auth";

const pagesRouter = express.Router();

pagesRouter.use(auth);

pagesRouter.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/dashboard");
    return;
  }

  res.render("index", {
    authError: req.query.authError === "true" ? "Wrong username or password" : req.query.authError,
  });
});

pagesRouter.get("/dashboard", (req, res) => {
  if (!req.user) {
    res.redirect("/");
    return;
  }

  res.render("dashboard", {
    user: req.user,
  });
});

pagesRouter.get("*", (_req, res) => {
  res.render("404");
});

export default pagesRouter;
