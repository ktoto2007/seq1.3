const { Op } = require('sequelize');
const Order = require('./models/Order');
const Item = require('./models/Item');
const User = require('./models/User');
const Post = require('./models/Post');
const Author = require('./models/Author');
const Book = require('./models/Book');
const Course = require('./models/Course');
const Student = require('./models/Student');
const seed = require('./seed')
const testConnection = require('./test-connection')
const sequelize = require('./database');

async function getUsersWithRecentPosts() {
  return User.findAll({
    include: [{
      model: Post,
      as: 'posts',
      where: { publishedAt: { [Op.gt]: '2023-01-01' } },
      required: true,
    }],
    order: [
      ['name', 'ASC'],
      [{ model: Post, as: 'posts' }, 'publishedAt', 'DESC']
    ],
  });
}

async function getAllAuthorsIncludingEmpty() {
    return Author.findAll({
      include: [{
        model: Book,
        as: 'books',
        required: false,
      }],
      order: [['lastName', 'ASC']],
    });
}

async function getStudentsInAdvancedCourses() {
    return Student.findAll({
      include: [{
        model: Course,
        as: 'courses',
        where: { credits: { [Op.gt]: 3 } },
        required: true,
        through: { attributes: [] }
      }],
      order: [
        ['name', 'ASC'],
        [{ model: Course, as: 'courses' }, 'title', 'ASC']
      ],
    });
}

async function getOrdersWithBulkItems() {
    return Order.findAll({
      include: [{
        model: Item,
        as: 'items',
        where: { quantity: { [Op.gt]: 2 } },
        required: true,
      }],
      order: [
        ['createdAt', 'DESC'],
        [{ model: Item, as: 'items' }, 'price', 'DESC']
      ],
    });
}

async function getActiveUsersWithPublishedPosts() {
    return User.findAll({
      where: { isActive: true },
      include: [{
        model: Post,
        as: 'posts',
        where: { status: 'published' },
        required: true,
      }],
      order: [
        ['name', 'ASC'],
        [{ model: Post, as: 'posts' }, 'createdAt', 'DESC']
      ],
    });
}

async function main() {
    const ok = await testConnection();
    if (!ok) process.exit(1);

    await seed();
  
    console.log('getUsersWithRecentPosts:');
    console.log(JSON.stringify(await getUsersWithRecentPosts(), null, 2));
  
    console.log('getAllAuthorsIncludingEmpty:');
    console.log(JSON.stringify(await getAllAuthorsIncludingEmpty(), null, 2));
  
    console.log('getStudentsInAdvancedCourses:');
    console.log(JSON.stringify(await getStudentsInAdvancedCourses(), null, 2));
  
    console.log('getOrdersWithBulkItems:');
    console.log(JSON.stringify(await getOrdersWithBulkItems(), null, 2));
  
    console.log('getActiveUsersWithPublishedPosts:');
    console.log(JSON.stringify(await getActiveUsersWithPublishedPosts(), null, 2));

    await sequelize.close();
  }
  
main().catch((err) => {
    console.error(err);
    process.exit(1);
});