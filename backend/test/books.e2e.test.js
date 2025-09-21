import express from "express";
import mongoose from "mongoose";
import request from "supertest";
import booksRoute from "../routes/booksRoute.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod, app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use("/books", booksRoute);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

test("POST /books creates a book", async () => {
  const res = await request(app).post("/books").send({
    title: "Clean Code",
    author: "Robert C. Martin",
    publishYear: 2008,
  });
  expect(res.status).toBe(201);
  expect(res.body.title).toBe("Clean Code");
});

test("GET /books returns list including created book", async () => {
  const res = await request(app).get("/books");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data.some((b) => b.title === "Clean Code")).toBe(true);
});
