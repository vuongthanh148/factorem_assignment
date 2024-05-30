import httpStatus from 'http-status';
import quotationService from '../services/quotation.service.js';
import { asyncHandler } from '../utils/async-handler.js';

const createQuotation = asyncHandler(async (req, res) => {
  const { itemId, quotation } = req.body;
  const userId = req.user.id;
  const createdQuotation = await quotationService.createQuotation(itemId, quotation, userId);
  res.status(httpStatus.CREATED).json(createdQuotation);
});

const approveQuotation = asyncHandler(async (req, res) => {
  const { quotationId } = req.body;
  const approvedQuotation = await quotationService.approveQuotation(quotationId);
  res.status(httpStatus.OK).json(approvedQuotation);
});

const acceptQuotation = asyncHandler(async (req, res) => {
  const { quotationId } = req.body;
  const acceptedQuotation = await quotationService.acceptQuotation(quotationId);
  res.status(httpStatus.OK).json(acceptedQuotation);
});

export default {
  createQuotation,
  approveQuotation,
  acceptQuotation
};
