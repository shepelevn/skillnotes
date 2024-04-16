import express from "express";
import nunjucks from "nunjucks";
import path from "path";

const app = express();

nunjucks.configure(path.join(__dirname, "views"), {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");
