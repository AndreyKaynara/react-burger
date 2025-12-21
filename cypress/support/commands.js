// Команда для авторизации
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.contains('button', 'Войти').click();
  cy.url().should('eq', `${Cypress.config().baseUrl}/`);
});

// Команда для перетаскивания ингредиента
Cypress.Commands.add('dragIngredient', (ingredientName) => {
  cy.contains(ingredientName).parents('[class*="itemCard"]').as('ingredient');

  cy.get('[class*="burgerConstructor"]').find('[class*="list"]').first().as('constructor');

  const dataTransfer = new DataTransfer();
  // Установим хотя бы один тип данных, чтобы HTML5 backend не игнорировал dnd
  try {
    dataTransfer.setData('text/plain', '{}');
  } catch (e) {}
  cy.get('@ingredient').trigger('dragstart', { dataTransfer });
  cy.get('@constructor').trigger('dragenter', { dataTransfer });
  cy.get('@constructor').trigger('drop', { dataTransfer });
  cy.get('@ingredient').trigger('dragend');
});

// Команда для ожидания загрузки ингредиентов
Cypress.Commands.add('waitForIngredients', () => {
  // Ждем появления хотя бы одной карточки ингредиента на странице
  cy.get('[class*="itemCard"]', { timeout: 15000 }).should('have.length.greaterThan', 0);
});

// Универсальная команда для HTML5 DnD: перетащить элемент (по алиасу) в конструктор
Cypress.Commands.add('dndToConstructor', (alias) => {
  const dataTransfer = new DataTransfer();
  try {
    dataTransfer.setData('text/plain', '{}');
  } catch (e) {}
  cy.get('[class*="burgerConstructor"]').find('[class*="list"]').first().scrollIntoView();
  cy.get(alias).trigger('dragstart', { dataTransfer, force: true });
  cy.get('[class*="burgerConstructor"]')
    .find('[class*="list"]')
    .first()
    .trigger('dragenter', { dataTransfer, force: true });
  cy.get('[class*="burgerConstructor"]')
    .find('[class*="list"]')
    .first()
    .trigger('dragover', { dataTransfer, force: true, clientX: 10, clientY: 10 });
  cy.get('[class*="burgerConstructor"]').find('[class*="list"]').first().trigger('drop', { dataTransfer, force: true });
  cy.get(alias).trigger('dragend', { force: true });
});

// Команда для очистки локального хранилища и куки
Cypress.Commands.add('clearAuth', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});
