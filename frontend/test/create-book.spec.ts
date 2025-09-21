import { test, expect } from "@playwright/test";

test("can create a book via UI and it appears in list", async ({
  page,
  request,
}) => {
  // Test data we will type into the form
  const title = "Playwright Book";
  const author = "Test Author";
  const year = 2024;

  // Open the "Create Book" page directly
  await page.goto("http://localhost:5173/books/create");

  // Fill inputs by targeting the <label> text and the next <input>
  await page.locator('label:has-text("Title") + input').fill(title);
  await page.locator('label:has-text("Author") + input').fill(author);
  await page
    .locator('label:has-text("Publish Year") + input')
    .fill(String(year));

  // Submit the form
  await page.getByRole("button", { name: /save/i }).click();

  // After save, we expect to be redirected to "/"
  await expect(page).toHaveURL("http://localhost:5173/");

  // The new book title should be visible in the list
  await expect(page.getByText(title)).toBeVisible();

  // Cleanup: remove the created book using the backend API
  const list = await request.get("http://127.0.0.1:5555/books");
  const json = await list.json();
  const match = (json.data as any[]).find((b) => b.title === title);
  if (match?._id) {
    await request.delete(`http://127.0.0.1:5555/books/${match._id}`);
  }
});
