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


async function updateListItemStatus(listItem) {
  const itemRepository = getRepository(Item);
  try {
    const items = await itemRepository.findByIds(listItem.map(item => item.itemId));

    if (items.length !== listItem.length) throw new CustomError({ code: '400001', message: "List item is invalid!", data: listItem });

    const listItemToUpdate = []
    for (const item of items) {
      if (item.status !== 'PENDING') {
        throw new CustomError({ code: '400001', message: 'Item status is not PENDING.', data: item });
      }

      const { status } = listItem.find(i => i.itemId === item.id);

      if (STATUS_LIST[status] === undefined) {
        throw new CustomError({ code: '400001', message: 'Invalid status.' });
      }

      item.status = status;
      listItemToUpdate.push(item);
    }
    const listUpdatedItem = await itemRepository.save(listItemToUpdate);
    return listUpdatedItem;
  } catch (error) {
    throw error;
  }
}



export default {
  updateItemStatus,
  updateListItemStatus
};
