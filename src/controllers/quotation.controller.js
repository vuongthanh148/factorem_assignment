import httpStatus from 'http-status';
import quotationService from '../services/quotation.service.js';
import { asyncHandler } from '../utils/async-handler.js';

const createQuotation = asyncHandler(async (req, res) => {
  const { itemId, quotation } = req.body;
  const createdQuotation = await quotationService.createQuotation(itemId, quotation);
  res.status(httpStatus.CREATED).json(createdQuotation);
});

const approveQuotation = asyncHandler(async (req, res) => {
  const { quotationId } = req.body;
  const approvedQuotation = await quotationService.approveQuotation(quotationId);
  res.status(httpStatus.OK).json(approvedQuotation);
});

export default {
  createQuotation, approveQuotation
};
