import { test, expect } from "@playwright/test";

test("can edit a book via UI", async ({ page, request }) => {
  // Seed: create a temporary book directly via API so we have something to edit
  const seed = {
    title: `E2E Edit ${Date.now()}`,
    author: "Temp",
    publishYear: 2023,
  };
  const create = await request.post("http://127.0.0.1:5555/books", {
    data: seed,
  });
  expect(create.ok()).toBeTruthy();
  const created = await create.json();
  const id = created._id;

  // Go to the edit page for that book
  await page.goto(`http://localhost:5173/books/edit/${id}`);

  // Change all fields using the same label+input pattern
  await page
    .locator('label:has-text("Title") + input')
    .fill("E2E Edited Title");
  await page.locator('label:has-text("Author") + input').fill("Edited Author");
  await page.locator('label:has-text("Publish Year") + input').fill("2025");

  // Save changes
  await page.getByRole("button", { name: /save/i }).click();

  // Back on "/", the edited title should be visible
  await expect(page).toHaveURL("http://localhost:5173/");
  await expect(page.getByText("E2E Edited Title")).toBeVisible();

  // Cleanup: delete the temporary book
  await request.delete(`http://127.0.0.1:5555/books/${id}`);
});
