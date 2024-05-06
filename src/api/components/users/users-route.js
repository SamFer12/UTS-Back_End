const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const usersControllers = require('./users-controller');
const usersValidator = require('./users-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  // Get list of users
  route.get('/', authenticationMiddleware, usersControllers.getUsers);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(usersValidator.createUser),
    usersControllers.createUser
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, usersControllers.getUser);

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(usersValidator.updateUser),
    usersControllers.updateUser
  );

  // Delete user
  route.delete('/:id', authenticationMiddleware, usersControllers.deleteUser);

  // Change password
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(usersValidator.changePassword),
    usersControllers.changePassword
  );
  
};
route.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page_number) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const sortField = req.query.sort ? req.query.sort.split(':')[0] : 'email';
    const sortOrder = req.query.sort ? (req.query.sort.split(':')[1] === 'desc' ? -1 : 1) : 1;
    const searchField = req.query.search ? req.query.search.split(':')[0] : '';
    const searchKey = req.query.search ? req.query.search.split(':')[1] : '';
    const query = {};
    if (searchField && searchKey) {
      query[searchField] = { $regex: new RegExp(searchKey, 'i') };
    }
    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);
    const skip = (page - 1) * pageSize;
    const users = await User.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(pageSize);

    const response = {
      page_number: page,
      page_size: pageSize,
      count: users.length,
      total_pages: totalPages,
      has_previous_page: page > 1,
      has_next_page: page < totalPages,
      data: users
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
route.post('/banking/accounts', async (req, res) => {
  try {
    const { nim, name, email, balance } = req.body;
    if (!nim || !name || !email || !balance) {
      return res.status(400).json({ message: 'Invalid request body' });
    }
    if (parseInt(nim) % 2 !== 0) {
      return res.status(400).json({ message: 'NIM must be even' });
    }

    const account = new Account({
      nim,
      name,
      email,
      balance
    });
    await account.save();

    res.status(201).json({ message: 'Account created successfully', account });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
route.post('/banking/accounts', async (req, res) => {
  try {
    const { nim, name, email, balance } = req.body;
    if (!nim || !name || !email || !balance) {
      return res.status(400).json({ message: 'Invalid request body' });
    }
    if (parseInt(nim) % 2 !== 0) {
      return res.status(400).json({ message: 'NIM must be even' });
    }

    const account = new Account({
      nim,
      name,
      email,
      balance
    });
    await account.save();

    res.status(201).json({ message: 'Account created successfully', account });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


