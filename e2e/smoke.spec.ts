import { test, expect } from '@playwright/test';

test('carga ES con hero y secciones', async ({ page }) => {
  await page.goto('/es');
  await expect(page.getByText('Hola, soy')).toBeVisible();
  await expect(page.locator('#about')).toBeAttached();
  await expect(page.locator('#stack')).toBeAttached();
  await expect(page.locator('#work')).toBeAttached();
  await expect(page.locator('#contact')).toBeAttached();
});

test('switch de idioma a EN', async ({ page }) => {
  await page.goto('/es');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page).toHaveURL(/\/en/);
  await expect(page.getByText("Hi, I'm")).toBeVisible();
});

test('canvas del teclado monta al hacer scroll', async ({ page }) => {
  await page.goto('/es');
  await page.locator('#stack').scrollIntoViewIfNeeded();
  await expect(page.locator('#stack canvas')).toBeVisible({ timeout: 15_000 });
});

test('tecla física activa tooltip del stack', async ({ page }) => {
  await page.goto('/es');
  await page.locator('#stack').scrollIntoViewIfNeeded();
  await page.locator('#stack canvas').waitFor({ timeout: 15_000 });
  await page.locator('body').click();
  await page.keyboard.press('t');
  await expect(page.locator('#stack').getByText('TypeScript', { exact: true })).toBeVisible({ timeout: 10_000 });
});

test('validación del form de contacto', async ({ page }) => {
  await page.goto('/es');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page.getByText('Escribe tu nombre')).toBeVisible();
  await expect(page.getByText('Ese email no parece válido')).toBeVisible();
});

test('proyectos visibles con imágenes', async ({ page }) => {
  await page.goto('/es');
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('#work').getByText('NutriCita')).toBeVisible();
});
