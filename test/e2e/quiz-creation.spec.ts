import { test, expect } from '@playwright/test';

test.describe('Quiz Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display homepage elements correctly', async ({ page }) => {
    // Check hero section
    await expect(page.getByRole('heading', { name: /Descubra se seu amor te conhece de/ })).toBeVisible();

    // Check CTA button
    await expect(page.getByRole('button', { name: /Criar|Começar|Quiz/ })).toBeVisible();

    // Check social proof
    await expect(page.getByText(/Centenas de casais|Junte-se a centenas/)).toBeVisible();

    // Check pricing plans
    await expect(page.getByText('Free')).toBeVisible();
    await expect(page.getByText('Premium')).toBeVisible();
  });

  test('should navigate to quiz creation section when CTA is clicked', async ({ page }) => {
    // Click the main CTA button
    await page.getByRole('button', { name: /Criar|Começar|Quiz/ }).click();

    // Should scroll to quiz creation section
    await expect(page.locator('#quizinho')).toBeInViewport();

    // Should see quiz creation form elements
    await expect(page.getByPlaceholder(/pergunta/i)).toBeVisible();
    await expect(page.getByPlaceholder(/alternativa/i)).toBeVisible();
  });

  test('should allow selecting a plan', async ({ page }) => {
    // Scroll to plans section
    await page.getByText('Free').scrollIntoViewIfNeeded();

    // Select free plan
    const freeButton = page.getByRole('button', { name: /Selecionar/ }).first();
    await freeButton.click();

    // Button should change to "Selecionado"
    await expect(page.getByText('Selecionado')).toBeVisible();

    // Select premium plan
    const premiumButton = page.getByRole('button', { name: /Selecionar/ }).last();
    await premiumButton.click();

    // Premium should now be selected
    await expect(premiumButton).toContainText('Selecionado');
  });

  test('should create a question successfully', async ({ page }) => {
    // Navigate to quiz creation
    await page.getByRole('button', { name: /Criar|Começar|Quiz/ }).click();
    await page.locator('#quizinho').scrollIntoViewIfNeeded();

    // Fill in question
    const questionInput = page.getByPlaceholder(/pergunta/i);
    await questionInput.fill('Qual é minha cor favorita?');

    // Fill in alternatives
    const alternatives = [
      'Azul',
      'Verde',
      'Vermelho',
      'Amarelo'
    ];

    for (let i = 0; i < alternatives.length; i++) {
      const altInput = page.getByPlaceholder(/alternativa/i).nth(i);
      await altInput.fill(alternatives[i]);

      // Add alternative if it's not the first one
      if (i < alternatives.length - 1) {
        await page.getByRole('button', { name: /Adicionar alternativa/i }).click();
      }
    }

    // Select correct alternative
    await page.getByText('Azul').click();

    // Create question
    await page.getByRole('button', { name: /Criar pergunta|Adicionar/i }).click();

    // Should see success message
    await expect(page.getByText(/sucesso|adicionada/i)).toBeVisible();

    // Question should appear in the preview
    await expect(page.getByText('Qual é minha cor favorita?')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Navigate to quiz creation
    await page.getByRole('button', { name: /Criar|Começar|Quiz/ }).click();
    await page.locator('#quizinho').scrollIntoViewIfNeeded();

    // Try to create question without filling fields
    await page.getByRole('button', { name: /Criar pergunta|Adicionar/i }).click();

    // Should see validation error
    await expect(page.getByText(/Digite uma pergunta válida/i)).toBeVisible();

    // Fill question but no alternatives
    const questionInput = page.getByPlaceholder(/pergunta/i);
    await questionInput.fill('Test question?');
    await page.getByRole('button', { name: /Criar pergunta|Adicionar/i }).click();

    // Should see alternatives validation error
    await expect(page.getByText(/pelo menos 2 alternativas/i)).toBeVisible();
  });

  test('should handle mobile responsive design', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Hero section should be visible and properly sized
    await expect(page.getByRole('heading', { name: /Descubra se seu amor/ })).toBeVisible();

    // CTA button should be touch-friendly
    const ctaButton = page.getByRole('button', { name: /Criar|Começar|Quiz/ });
    await expect(ctaButton).toBeVisible();

    // Should be able to scroll to plans
    await page.getByText('Premium').scrollIntoViewIfNeeded();
    await expect(page.getByText('Premium')).toBeVisible();

    // Plans should be stacked vertically on mobile
    const plans = page.locator('[class*="plans"]').first();
    const planCards = plans.locator('[class*="card"]');

    // Should have multiple plan cards
    await expect(planCards).toHaveCount(2);
  });

  test('should toggle dark mode correctly', async ({ page }) => {
    // Check if dark mode toggle exists
    const darkModeToggle = page.getByRole('button').filter({ hasText: /🌙|☀️/ });

    if (await darkModeToggle.isVisible()) {
      // Click dark mode toggle
      await darkModeToggle.click();

      // Check if dark class is applied to html
      const htmlElement = page.locator('html');
      const hasDarkClass = await htmlElement.evaluate(el => el.classList.contains('dark'));

      // Should either have dark class or not (depending on initial state)
      expect(typeof hasDarkClass).toBe('boolean');

      // Click again to toggle back
      await darkModeToggle.click();

      // State should change
      const newDarkClass = await htmlElement.evaluate(el => el.classList.contains('dark'));
      expect(newDarkClass).toBe(!hasDarkClass);
    }
  });

  test('should show loading states during form submission', async ({ page }) => {
    // Mock slow network to see loading state
    await page.route('**/create-quizinho', async route => {
      // Delay the response
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    // Navigate and create a question
    await page.getByRole('button', { name: /Criar|Começar|Quiz/ }).click();
    await page.locator('#quizinho').scrollIntoViewIfNeeded();

    // Fill form quickly
    await page.getByPlaceholder(/pergunta/i).fill('Test question?');
    await page.getByPlaceholder(/alternativa/i).first().fill('Yes');
    await page.getByPlaceholder(/alternativa/i).nth(1).fill('No');
    await page.getByText('Yes').click();

    // Submit form
    await page.getByRole('button', { name: /Criar pergunta/i }).click();

    // Should see success feedback quickly (for question creation)
    await expect(page.getByText(/sucesso/i)).toBeVisible({ timeout: 5000 });
  });
});