import httpStatus from 'http-status';
import itemService from '../services/item.service.js';
import { asyncHandler } from '../utils/async-handler.js';

const updateItemStatus = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const { status } = req.body
  const updatedItem = await itemService.updateItemStatus(itemId, status);
  res.status(httpStatus.OK).json(updatedItem);
});

const updateListItemStatus = asyncHandler(async (req, res) => {
  const { listItem } = req.body
  const listUpdatedItem = await itemService.updateListItemStatus(listItem);
  res.status(httpStatus.OK).json(listUpdatedItem);
});


export default {
  updateItemStatus,
  updateListItemStatus
};
