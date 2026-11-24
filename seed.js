
const sequelize = require('./database');
const models = require('./models');

async function seed() {
  await sequelize.sync({ force: true });

  const users = await models.User.bulkCreate(
    [
      { name: 'Alice',   email: 'alice@example.com',   isActive: true },
      { name: 'Bob',     email: 'bob@example.com',     isActive: true },
      { name: 'Charlie', email: 'charlie@example.com', isActive: false },
    ],
    { returning: true }
  );

  await models.Post.bulkCreate([
    { title: 'Первый пост Алисы',  status: 'published', publishedAt: new Date('2024-01-10'), authorId: users[0].id },
    { title: 'Второй пост Алисы',  status: 'draft',     publishedAt: new Date('2024-02-15'), authorId: users[0].id },
    { title: 'Пост Боба',          status: 'archived',  publishedAt: new Date('2024-03-01'), authorId: users[1].id },

  ]);

  const authors = await models.Author.bulkCreate(
    [
      { firstName: 'Лев',    lastName: 'Толстой',     country: 'Россия' },
      { firstName: 'Фёдор',  lastName: 'Достоевский', country: 'Россия' },
      { firstName: 'Джордж', lastName: 'Оруэлл',      country: 'Великобритания' },
    ],
    { returning: true }
  );

  await models.Book.bulkCreate([
    { title: 'Война и мир',               year: 1869, genre: 'Роман', authorId: authors[0].id },
    { title: 'Анна Каренина',             year: 1877, genre: 'Роман', authorId: authors[0].id },
    { title: 'Преступление и наказание',  year: 1866, genre: 'Роман', authorId: authors[1].id },
    { title: 'Идиот',                     year: 1869, genre: 'Роман', authorId: authors[1].id },
  ]);

  const students = await models.Student.bulkCreate(
    [
      { name: 'Мария Смирнова', group: 'A-101' },
      { name: 'Иван Кузнецов',  group: 'B-202' },
    ],
    { returning: true }
  );

  const courses = await models.Course.bulkCreate(
    [
      { title: 'Математический анализ', credits: 5 },
      { title: 'Программирование',      credits: 4 },
      { title: 'Философия',             credits: 2 },
    ],
    { returning: true }
  );

  await models.Enrollment.bulkCreate([
    { StudentId: students[0].id, CourseId: courses[0].id, grade: 5 },
    { StudentId: students[0].id, CourseId: courses[1].id, grade: 4 },
    { StudentId: students[1].id, CourseId: courses[1].id, grade: 3 },
    { StudentId: students[1].id, CourseId: courses[2].id, grade: 5 },
  ]);

  const orders = await models.Order.bulkCreate(
    [
      { number: 'ORD-001', status: 'paid' },
      { number: 'ORD-002', status: 'new'  },
    ],
    { returning: true }
  );

  await models.Item.bulkCreate([
    { productName: 'Ноутбук',    quantity: 1, price: 79999.99, orderId: orders[0].id },
    { productName: 'Мышь',       quantity: 3, price: 1500.00,  orderId: orders[0].id },
    { productName: 'Клавиатура', quantity: 1, price: 3500.00,  orderId: orders[1].id },
    { productName: 'Монитор',    quantity: 4, price: 25000.00, orderId: orders[1].id },
  ]);
}

module.exports = seed