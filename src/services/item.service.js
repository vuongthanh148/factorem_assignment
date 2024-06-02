/* eslint-disable no-magic-numbers */
import { getRepository } from 'typeorm';
import Item from '../entity/item.entity.js';
import { STATUS_LIST } from '../shared/constants/app.constant.js';
import { CustomError } from '../utils/custom-error.js';

async function updateItemStatus(itemId, newStatus) {
  const itemRepository = getRepository(Item);

  try {
    const item = await itemRepository.findOne({ where: { id: itemId } });
    if (!item) {
      throw new CustomError({ code: '400001', message: "Item not found" });
    }
    if (item.status !== 'PENDING') {
      throw new CustomError({ code: '400001', message: 'Item status is not PENDING.', data: item });
    }

    if (STATUS_LIST[newStatus] === undefined) {
      throw new CustomError({ code: '400001', message: 'Invalid status.' });
    }

    item.status = newStatus;
    itemRepository.save(item);

    return item;

  } catch (error) {
    throw error;
  }
}

export default {
  updateItemStatus
};
