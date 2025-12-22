import { SEL } from '../support/selectors';

describe('Конструктор бургеров', () => {
  const TEST_USER = {
    email: 'testing.cat@example.org',
    password: 'cats_also_like_burgers',
  };

  beforeEach(() => {
    cy.visit('/');
    cy.waitForIngredients();
  });

  describe('Перетаскивание ингредиентов', () => {
    it('должно добавлять булку в конструктор при перетаскивании', () => {
      // Находим первую булку
      cy.get(SEL.bunSection).find(SEL.itemCard).first().as('bun');

      // Получаем название булки
      cy.get('@bun').find('p').invoke('text').as('bunName');

      // Перетаскиваем булку
      cy.dndToConstructor('@bun');

      // Проверяем, что булка появилась в конструкторе (верх и низ)
      cy.get('@bunName').then((bunName) => {
        cy.get(SEL.burgerConstructor).contains(`${bunName} (верх)`).should('be.visible');
        cy.get(SEL.burgerConstructor).contains(`${bunName} (низ)`).should('be.visible');
      });
    });

    it('должно добавлять начинку в конструктор при перетаскивании', () => {
      // Находим первую начинку
      cy.get(SEL.mainSection).find(SEL.itemCard).first().as('filling');

      // Получаем название начинки
      cy.get('@filling').find('p').invoke('text').as('fillingName');

      // Перетаскиваем начинку
      cy.dndToConstructor('@filling');

      // Проверяем, что начинка появилась в конструкторе
      cy.get('@fillingName').then((fillingName) => {
        cy.get(SEL.burgerConstructor).contains(fillingName).should('be.visible');
      });
    });

    it('должно добавлять соус в конструктор при перетаскивании', () => {
      // Находим первый соус
      cy.get(SEL.sauceSection).find(SEL.itemCard).first().as('sauce');

      // Получаем название соуса
      cy.get('@sauce').find('p').invoke('text').as('sauceName');

      // Перетаскиваем соус
      cy.dndToConstructor('@sauce');

      // Проверяем, что соус появился в конструкторе
      cy.get('@sauceName').then((sauceName) => {
        cy.get(SEL.burgerConstructor).contains(sauceName).should('be.visible');
      });
    });

    it('должно обновлять счетчик ингредиента после добавления', () => {
      // Находим первую начинку
      cy.get(SEL.mainSection).find(SEL.itemCard).first().as('filling');

      // Проверяем, что счетчика нет до добавления
      cy.get('@filling').find(SEL.counter).should('not.exist');

      // Перетаскиваем начинку
      // Сохраняем имя начинки и перетаскиваем по алиасу
      cy.get('@filling').find('p').invoke('text').as('fillingName');
      cy.dndToConstructor('@filling');

      // Проверяем, что счетчик появился и показывает 1
      cy.get('@fillingName').then((name) => {
        const targetName = (name || '').trim();
        // ВАЖНО: не сохраняем элемент как alias, чтобы Cypress мог повторно искать при ретраях
        cy.get(SEL.mainSection)
          .find(SEL.itemCard)
          .contains('p', targetName, { timeout: 8000 })
          .parents(SEL.itemCard)
          .first()
          .scrollIntoView()
          .find(SEL.counter, { timeout: 8000 })
          .should(($el) => {
            expect($el.text().trim()).to.contain('1');
          });
      });
    });

    it('должно заменять булку при перетаскивании другой булки', () => {
      // Находим первую булку
      cy.get(SEL.bunSection).find(SEL.itemCard).first().as('firstBun');

      cy.get('@firstBun').find('p').invoke('text').as('firstBunName');

      // Перетаскиваем первую булку
      cy.dndToConstructor('@firstBun');

      // Находим вторую булку
      cy.get(SEL.bunSection).find(SEL.itemCard).eq(1).as('secondBun');

      cy.get('@secondBun').find('p').invoke('text').as('secondBunName');

      // Перетаскиваем вторую булку
      cy.dndToConstructor('@secondBun');

      // Проверяем, что в конструкторе теперь вторая булка
      cy.get('@secondBunName').then((secondBunName) => {
        cy.get(SEL.burgerConstructor).contains(`${secondBunName} (верх)`).should('be.visible');
      });

      // Проверяем, что первой булки больше нет
      cy.get('@firstBunName').then((firstBunName) => {
        cy.get(SEL.burgerConstructor).contains(`${firstBunName} (верх)`).should('not.exist');
      });
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открывать модальное окно при клике на ингредиент', () => {
      // Кликаем на первую булку
      cy.get(SEL.bunSection).find(SEL.itemCard).first().click();

      // Проверяем, что модальное окно открылось
      cy.get(SEL.modal).should('be.visible');
      cy.contains('Детали ингредиента').should('be.visible');
    });

    it('должно отображать корректные данные ингредиента в модальном окне', () => {
      // Находим первую булку и сохраняем её данные
      cy.get(SEL.bunSection).find(SEL.itemCard).first().as('bun');

      cy.get('@bun').find('p').invoke('text').as('bunName');
      cy.get('@bun').find(SEL.price).find('span').invoke('text').as('bunPrice');

      // Кликаем на булку
      cy.get('@bun').click();

      // Проверяем, что в модальном окне отображаются корректные данные
      cy.get('@bunName').then((bunName) => {
        cy.get(SEL.modal).contains(bunName).should('be.visible');
      });

      // В модальном окне рендерится image_large, поэтому проверим только наличие изображения
      cy.get(SEL.modal).find('img').should('be.visible');

      // Проверяем наличие информации о калориях, белках, жирах и углеводах
      cy.get(SEL.modal).contains('Калории').should('be.visible');
      cy.get(SEL.modal).contains('Белки').should('be.visible');
      cy.get(SEL.modal).contains('Жиры').should('be.visible');
      cy.get(SEL.modal).contains('Углеводы').should('be.visible');
    });

    it('должно закрывать модальное окно при клике на кнопку закрытия', () => {
      // Открываем модальное окно
      cy.get(SEL.bunSection).find(SEL.itemCard).first().click();

      // Проверяем, что модальное окно открыто
      cy.get(SEL.modal).should('be.visible');

      // Кликаем на кнопку закрытия
      cy.get(SEL.modal).find('button').first().click();

      // Проверяем, что модальное окно закрылось
      cy.get(SEL.modal).should('not.exist');
    });

    it('должно закрывать модальное окно при клике на оверлей', () => {
      // Открываем модальное окно
      cy.get(SEL.bunSection).find(SEL.itemCard).first().click();

      // Проверяем, что модальное окно открыто
      cy.get(SEL.modal).should('be.visible');

      // Кликаем на оверлей (за пределами контента модалки)
      cy.get(SEL.overlay).first().click(10, 10, { force: true });

      // Проверяем, что модальное окно закрылось
      cy.get(SEL.modal).should('not.exist');
    });

    it('должно закрывать модальное окно при нажатии Escape', () => {
      // Открываем модальное окно
      cy.get(SEL.bunSection).find(SEL.itemCard).first().click();

      // Проверяем, что модальное окно открыто
      cy.get(SEL.modal).should('be.visible');

      // Нажимаем Escape
      cy.get('body').type('{esc}');

      // Проверяем, что модальное окно закрылось
      cy.get(SEL.modal).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('должно перенаправлять на страницу логина при попытке оформить заказ без авторизации', () => {
      // Добавляем булку
      cy.get(SEL.bunSection).find(SEL.itemCard).first().as('bun');
      cy.dndToConstructor('@bun');

      // Кликаем на кнопку "Оформить заказ"
      cy.contains('button', 'Оформить заказ').click();

      // Проверяем, что нас перенаправило на страницу логина
      cy.url().should('include', '/login');
    });

    it('должно открывать модальное окно с данными заказа после успешного оформления', () => {
      // Авторизуемся
      cy.login(TEST_USER.email, TEST_USER.password);

      // Ждем загрузки ингредиентов
      cy.waitForIngredients();

      // Добавляем булку
      cy.get(SEL.bunSection).find(SEL.itemCard).first().as('bun');
      cy.dndToConstructor('@bun');

      // Добавляем начинку
      cy.get(SEL.mainSection).find(SEL.itemCard).first().as('filling');
      cy.dndToConstructor('@filling');

      // Стабим успешный ответ создания заказа
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: { success: true, order: { number: 12345 } },
      }).as('createOrder');

      // Кликаем на кнопку "Оформить заказ"
      cy.contains('button', 'Оформить заказ').click();

      // Ждем ответа и появления модального окна с заказом (может занять до 15 секунд)
      cy.wait('@createOrder');
      cy.get(SEL.modal, { timeout: 15000 }).should('be.visible');

      // Проверяем, что отображается номер заказа (любое число)
      cy.get(SEL.modal)
        .find(SEL.glowText)
        .should('be.visible')
        .invoke('text')
        .should('match', /^\d+$/);

      // Проверяем наличие текста "идентификатор заказа"
      cy.get(SEL.modal).contains('идентификатор заказа').should('be.visible');

      // Проверяем наличие иконки с галочкой
      cy.get(SEL.modal).find('svg').should('be.visible');

      // Проверяем наличие текста о готовности заказа
      cy.get(SEL.modal).contains('Ваш заказ начали готовить').should('be.visible');
    });

    it('должно закрывать модальное окно заказа при клике на кнопку закрытия', () => {
      // Авторизуемся
      cy.login(TEST_USER.email, TEST_USER.password);

      // Ждем загрузки ингредиентов
      cy.waitForIngredients();

      // Добавляем булку и начинку
      cy.get(SEL.bunSection).find(SEL.itemCard).first().as('bun');
      cy.dndToConstructor('@bun');

      cy.get(SEL.mainSection).find(SEL.itemCard).first().as('filling');
      cy.dndToConstructor('@filling');

      // Стабим успешный ответ создания заказа и оформляем заказ
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: { success: true, order: { number: 12345 } },
      }).as('createOrder');

      // Оформляем заказ
      cy.contains('button', 'Оформить заказ').click();

      // Ждем появления модального окна с заказом
      cy.wait('@createOrder');
      cy.get(SEL.modal, { timeout: 15000 }).should('be.visible');

      // Кликаем на кнопку закрытия
      cy.get(SEL.modal).find('button').first().click();

      // Проверяем, что модальное окно закрылось
      cy.get(SEL.modal).should('not.exist');

      // Проверяем, что конструктор очистился
      cy.get(SEL.burgerConstructor).contains('(верх)').should('not.exist');
    });

    it('должно очищать конструктор после успешного создания заказа', () => {
      // Авторизуемся
      cy.login(TEST_USER.email, TEST_USER.password);

      // Ждем загрузки ингредиентов
      cy.waitForIngredients();

      // Добавляем булку и начинку
      cy.get(SEL.bunSection).find(SEL.itemCard).first().as('bun');
      cy.dndToConstructor('@bun');
      cy.wait(100);

      cy.get(SEL.mainSection).find(SEL.itemCard).first().as('filling');
      cy.get('@filling').find('p').invoke('text').as('fillingName');
      cy.dndToConstructor('@filling');
      cy.wait(100);

      // Дождаться обновления цены как признак обновления конструктора
      cy.get(SEL.totalPrice)
        .find('span', { timeout: 10000 })
        .invoke('text')
        .then((price) => {
          expect(parseInt(price)).to.be.greaterThan(0);
        });

      // Проверяем, что ингредиенты добавлены (булка и начинка в конструкторе)
      cy.get(SEL.burgerConstructor).contains('(верх)', { timeout: 10000 }).should('exist');
      cy.get('@fillingName').then((fillingName) => {
        const name = (fillingName || '').trim();
        const short = name.slice(0, 6);
        cy.get(SEL.burgerConstructor).contains(short, { matchCase: false, timeout: 10000 }).should('exist');
      });

      // Стабим успешный ответ создания заказа и оформляем заказ
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: { success: true, order: { number: 12345 } },
      }).as('createOrder');

      // Оформляем заказ
      cy.contains('button', 'Оформить заказ').click();

      // Ждем появления модального окна
      cy.wait('@createOrder');
      cy.get(SEL.modal, { timeout: 15000 }).should('be.visible');

      // Закрываем модальное окно
      cy.get(SEL.modal).find('button').first().click();

      // Проверяем, что конструктор полностью очищен
      cy.get(SEL.burgerConstructor).contains('(верх)').should('not.exist');
      cy.get('@fillingName').then((fillingName) => {
        cy.get(SEL.burgerConstructor).contains(fillingName).should('not.exist');
      });

      // Проверяем, что цена сброшена до 0
      cy.get(SEL.totalPrice).contains('0').should('be.visible');
    });

    it('должно сбрасывать счетчики ингредиентов после создания заказа', () => {
      // Авторизуемся
      cy.login(TEST_USER.email, TEST_USER.password);

      // Ждем загрузки ингредиентов
      cy.waitForIngredients();

      // Добавляем булку
      cy.get(SEL.bunSection).find(SEL.itemCard).first().as('bun');
      cy.dndToConstructor('@bun');

      // Добавляем начинку дважды
      cy.get(SEL.mainSection).find(SEL.itemCard).first().as('filling');

      cy.dndToConstructor('@filling');
      cy.dndToConstructor('@filling');

      // Проверяем, что счетчики установлены
      // Для булки счётчик отображает 1 (верх/низ считаются как одна позиция в счётчике)
      cy.get('@bun').find(SEL.counter).should('contain', '1');
      cy.get('@filling').find(SEL.counter).should('contain', '2');

      // Стабим успешный ответ создания заказа и оформляем заказ
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: { success: true, order: { number: 12345 } },
      }).as('createOrder');

      // Оформляем заказ
      cy.contains('button', 'Оформить заказ').click();

      // Ждем и закрываем модальное окно
      cy.wait('@createOrder');
      cy.get(SEL.modal, { timeout: 15000 }).should('be.visible');
      cy.get(SEL.modal).find('button').first().click();

      // Проверяем, что счетчики сброшены
      cy.get('@bun').find(SEL.counter).should('not.exist');
      cy.get('@filling').find(SEL.counter).should('not.exist');
    });
  });

  describe('Интеграционный тест: полный флоу создания заказа', () => {
    it('должно проходить весь путь пользователя от сборки бургера до получения заказа', () => {
      // 1. Авторизация
      cy.login(TEST_USER.email, TEST_USER.password);

      // 2. Ожидание загрузки ингредиентов
      cy.waitForIngredients();

      // 3. Просмотр деталей ингредиента
      cy.get(SEL.bunSection).find(SEL.itemCard).first().as('bun');

      cy.get('@bun').click();
      cy.get(SEL.modal).should('be.visible');
      cy.contains('Детали ингредиента').should('be.visible');
      cy.get(SEL.modal).find('button').first().click();
      cy.get(SEL.modal).should('not.exist');

      // 4. Добавление булки
      cy.get('@bun').find('p').invoke('text').as('bunName');
      cy.dndToConstructor('@bun');

      cy.get('@bunName').then((bunName) => {
        cy.get(SEL.burgerConstructor).contains(`${bunName} (верх)`).should('exist');
      });

      // 5. Добавление соуса
      cy.get(SEL.sauceSection).find(SEL.itemCard).first().as('sauce');

      cy.dndToConstructor('@sauce');

      // 6. Добавление начинки
      cy.get(SEL.mainSection).find(SEL.itemCard).first().as('filling');

      cy.dndToConstructor('@filling');

      // 7. Проверка, что цена обновилась (больше 0)
      cy.get(SEL.totalPrice)
        .find('span')
        .invoke('text')
        .then((price) => {
          expect(parseInt(price)).to.be.greaterThan(0);
        });

      // 8. Оформление заказа — стабим успешный ответ
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: { success: true, order: { number: 12345 } },
      }).as('createOrder');

      // Оформляем заказ
      cy.contains('button', 'Оформить заказ').click();

      // 9. Ожидание и проверка модального окна с заказом
      cy.wait('@createOrder');
      cy.get(SEL.modal, { timeout: 15000 }).should('be.visible');
      cy.get(SEL.modal)
        .find(SEL.glowText)
        .should('be.visible')
        .invoke('text')
        .should('match', /^\d+$/);
      cy.get(SEL.modal).contains('идентификатор заказа').should('be.visible');
      cy.get(SEL.modal).contains('Ваш заказ начали готовить').should('be.visible');

      // 10. Закрытие модального окна
      cy.get(SEL.modal).find('button').first().click();
      cy.get(SEL.modal).should('not.exist');

      // 11. Проверка, что конструктор очищен
      cy.get(SEL.burgerConstructor).contains('(верх)').should('not.exist');
      cy.get(SEL.totalPrice).contains('0').should('be.visible');

      // 12. Проверка, что счетчики сброшены
      cy.get('@bun').find(SEL.counter).should('not.exist');
      cy.get('@sauce').find(SEL.counter).should('not.exist');
      cy.get('@filling').find(SEL.counter).should('not.exist');
    });
  });
});
