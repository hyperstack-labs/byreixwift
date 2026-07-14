import { test, expect } from "@playwright/test";

test.describe("Navigation and Basic App Integrity", () => {
  test("should load the landing page and verify brand elements", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");

    // Verify header title / logo exists
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // Verify main navigation buttons or call-to-actions exist
    const ctaButton = page.locator(
      'a[href="/login"], button:has-text("Connect Wallet"), button:has-text("Launch App")'
    );
    if ((await ctaButton.count()) > 0) {
      await expect(ctaButton.first()).toBeVisible();
    }
  });

  test("should navigate to key static information pages", async ({ page }) => {
    // Check Principles page
    await page.goto("/principles");
    await expect(page.locator("h1")).toBeVisible();

    // Check Privacy page
    await page.goto("/privacy");
    await expect(page.locator("h1")).toBeVisible();

    // Check Terms page
    await page.goto("/terms");
    await expect(page.locator("h1")).toBeVisible();

    // Check Team page
    await page.goto("/team");
    await expect(page.locator("h1")).toBeVisible();
  });
});
