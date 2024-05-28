import { createConnection, getRepository } from 'typeorm';
import User from '../src/entity/user.entity.js';
import { GlobalConfig } from '../src/shared/config/globalConfig.js';
import { logger } from '../src/shared/config/logger.js';
import { seedAdmin, seedUser } from './data.js';

createConnection(GlobalConfig.typeorm)
  .then(async connection => {
    logger.info('Connected to MySQL to seed data');

    const userRepository = getRepository(User);

    const seedDB = async () => {
      await connection.query('SET FOREIGN_KEY_CHECKS=0');

      await userRepository.clear();
      await userRepository.save(seedAdmin);
      await userRepository.save(seedUser);

      await connection.query('SET FOREIGN_KEY_CHECKS=1');
    };

    await seedDB();
    logger.info('Seed data successfully.');
    await connection.close();
  })
  .catch(error => {
    logger.error(error);
  });