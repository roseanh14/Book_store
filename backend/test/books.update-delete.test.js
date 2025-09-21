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

beforeEach(async () => {
  // Clean DB between tests for isolated, repeatable runs
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

test("PUT /books/:id updates an existing book", async () => {
  // 1) Seed a book we can update
  const created = await request(app).post("/books").send({
    title: "Original Title",
    author: "Someone",
    publishYear: 2000,
  });
  expect(created.status).toBe(201);

  // Some routes return the created doc directly, others wrap it in { data: doc }
  const createdDoc = created.body?.data ?? created.body;
  const id = createdDoc._id;
  expect(id).toBeDefined();

  // 2) Update the book
  const updated = await request(app).put(`/books/${id}`).send({
    title: "Updated Title",
    author: "Updated Author",
    publishYear: 2025,
  });
  expect(updated.status).toBe(200);

  // 3) Read it back and verify fields were changed
  const fetched = await request(app).get(`/books/${id}`);
  expect(fetched.status).toBe(200);
  const book = fetched.body?.data ?? fetched.body; // handle both response shapes
  expect(book.title).toBe("Updated Title");
  expect(book.author).toBe("Updated Author");
  expect(book.publishYear).toBe(2025);
});

test("DELETE /books/:id removes the book", async () => {
  // 1) Seed a book we will delete
  const created = await request(app).post("/books").send({
    title: "To Be Deleted",
    author: "Temp",
    publishYear: 1999,
  });
  expect(created.status).toBe(201);
  const id = (created.body?.data ?? created.body)._id;

  // 2) Delete it
  const del = await request(app).delete(`/books/${id}`);
  expect(del.status).toBe(200);

  // 3) List all and make sure it’s not there anymore
  const list = await request(app).get("/books");
  expect(list.status).toBe(200);
  const items = list.body?.data ?? [];
  expect(Array.isArray(items)).toBe(true);
  expect(items.some((b) => b._id === id || b.title === "To Be Deleted")).toBe(
    false
  );
});
