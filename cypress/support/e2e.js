import './commands';

// Глобальная настройка перед каждым тестом
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});
