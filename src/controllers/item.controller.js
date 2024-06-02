import httpStatus from 'http-status';
import itemService from '../services/item.service.js';
import { asyncHandler } from '../utils/async-handler.js';

const updateItemStatus = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const { status } = req.body
  const updatedItem = await itemService.updateItemStatus(itemId, status);
  res.status(httpStatus.OK).json(updatedItem);
});


export default {
  updateItemStatus,
};
