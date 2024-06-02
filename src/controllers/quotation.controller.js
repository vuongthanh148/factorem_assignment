import httpStatus from 'http-status';
import quotationService from '../services/quotation.service.js';
import { asyncHandler } from '../utils/async-handler.js';

const createQuotation = asyncHandler(async (req, res) => {
  const { itemId, quotation } = req.body;
  const userId = req.user.id;
  const createdQuotation = await quotationService.createQuotation(itemId, quotation, userId);
  res.status(httpStatus.CREATED).json(createdQuotation);
});

const createListQuotation = asyncHandler(async (req, res) => {
  const { quotations } = req.body;
  const userId = req.user.id;
  const createdQuotation = await quotationService.createListQuotation(quotations, userId);
  res.status(httpStatus.CREATED).json(createdQuotation);
});

const updateQuotationStatus = asyncHandler(async (req, res) => {
  const { quotationId } = req.params;
  const { status } = req.body;
  const updatedQuotation = await quotationService.updateQuotationStatus(quotationId, status);
  res.status(httpStatus.OK).json(updatedQuotation);
});

const deleteQuotation = asyncHandler(async (req, res) => {
  const { quotationId } = req.params;
  const deletedQuotation = await quotationService.deleteQuotation(quotationId);
  res.status(httpStatus.OK).json(deletedQuotation);
});

const deleteListQuotation = asyncHandler(async (req, res) => {
  const { quotationIds } = req.body;
  console.log({ quotationIds })
  const deletedQuotations = await quotationService.deleteListQuotation(quotationIds);
  res.status(httpStatus.OK).json(deletedQuotations);
});

const acceptQuotation = asyncHandler(async (req, res) => {
  const { quotationId } = req.body;
  const acceptedQuotation = await quotationService.acceptQuotation(quotationId);
  res.status(httpStatus.OK).json(acceptedQuotation);
});


async function getAllQuotationBySupplier(req, res) {
  const { supplierId } = req.params; // Get supplierId from params
  const quotations = await quotationService.getAllQuotationBySupplier(supplierId);
  res.status(httpStatus.OK).json(quotations);
}


export default {
  createQuotation,
  deleteListQuotation,
  deleteQuotation,
  createListQuotation,
  updateQuotationStatus,
  acceptQuotation,
  getAllQuotationBySupplier,
};
