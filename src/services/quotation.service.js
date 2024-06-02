/* eslint-disable no-magic-numbers */
import { In, getRepository } from 'typeorm';
import Item from '../entity/item.entity.js';
import Quotation from '../entity/quotation.entity.js';
import { STATUS_LIST } from '../shared/constants/app.constant.js';
import { ErrorCode, ErrorMessage } from '../shared/constants/error.constant.js';
import { CustomError } from '../utils/custom-error.js';


async function createQuotation(itemId, quotationBody, userId) {
  const quotationRepository = getRepository(Quotation);
  const itemRepository = getRepository(Item);

  try {
    const item = await itemRepository.findOne({
      where: {
        id: itemId,
        status: STATUS_LIST.APPROVED,
        project: { status: STATUS_LIST.APPROVED }
      },
      relations: ["project"]
    });
    if (!item) {
      throw new CustomError({ code: ErrorCode.ITEM_NOT_FOUND, message: ErrorMessage.ITEM_NOT_FOUND });
    }

    const createdQuotation = await quotationRepository.save({ ...quotationBody, item, supplier: userId });

    return createdQuotation;
  } catch (error) {
    throw error;
  }
}

async function createListQuotation(quotations, userId) {
  const quotationRepository = getRepository(Quotation);
  const itemRepository = getRepository(Item);

  try {
    const items = await itemRepository.find({
      where: {
        id: In(quotations.map(q => q.itemId)), status: STATUS_LIST.APPROVED, project: { status: STATUS_LIST.APPROVED }
      }, relations: ["project"]
    });

    const createdQuotations = quotations.map(({ quotation, itemId }) => {
      const item = items.find(i => i.id === itemId);
      if (!item) throw new CustomError({ code: ErrorCode.ITEM_NOT_FOUND, message: ErrorMessage.ITEM_NOT_FOUND });
      return { ...quotation, item, supplier: userId };
    });

    const savedQuotations = await quotationRepository.save(createdQuotations);

    return savedQuotations;
  } catch (error) {
    throw error;
  }
}

async function updateQuotationStatus(quotationId, status) {
  const quotationRepository = getRepository(Quotation);
  if (!quotationId) throw new CustomError({ code: '400004', message: 'Quotation id is required!' })
  try {
    const quotation = await quotationRepository.findOne({
      where: {
        id: quotationId,
        item: {
          status: STATUS_LIST.APPROVED,
          project: { status: STATUS_LIST.APPROVED }
        },
      },
      relations: ["item", "item.project"]
    });

    if (!quotation) {
      throw new CustomError({ code: '400004', message: 'Quotation not found!' });
    }

    if (status === STATUS_LIST.ACCEPTED) throw new CustomError({ code: '400004', message: 'Admin cannot accept quotation!', data: quotation });

    if (quotation.status === STATUS_LIST.DELIVERED) throw new CustomError({ code: '400004', message: 'This quotation is delivered!', data: quotation });


    if (status === STATUS_LIST.APPROVED && quotation.status == STATUS_LIST.APPROVED) {
      throw new CustomError({ code: '400004', message: 'Quotation already approved!', data: quotation });
    }

    if (status === STATUS_LIST.DELIVERED && quotation.status !== STATUS_LIST.ACCEPTED) {
      throw new CustomError({ code: '400004', message: 'Quotation must be accepted before delivered!', data: quotation });
    }

    quotation.status = status;
    const approvedQuotation = await quotationRepository.save(quotation);

    return approvedQuotation;
  } catch (error) {
    throw error;
  }
}

async function deleteQuotation(quotationId) {
  const quotationRepository = getRepository(Quotation);
  try {
    const deletedQuotation = await quotationRepository.delete({ id: quotationId })
    return deletedQuotation;
  }
  catch (error) {
    throw error;
  }
}

function deleteListQuotation(quotationIds) {
  const quotationRepository = getRepository(Quotation);
  try {
    const deletedQuotations = quotationRepository.delete(quotationIds)
    return deletedQuotations;
  }
  catch (error) {
    throw error;
  }
}

async function acceptQuotation(quotationId) {
  const quotationRepository = getRepository(Quotation);
  if (!quotationId) throw new CustomError({ code: '400004', message: 'Quotation id is required!' })
  try {
    const quotation = await quotationRepository.findOne({
      where: {
        id: quotationId,
        status: STATUS_LIST.APPROVED
      },
      relations: ["item"]
    });

    if (!quotation) {
      throw new CustomError({ code: '400004', message: 'No approved quotation found for this id to accept!' });
    }

    quotation.status = STATUS_LIST.ACCEPTED;
    const acceptedQuotation = await quotationRepository.save(quotation);

    const itemQuotations = await quotationRepository.find({
      where: {
        item: {
          id: quotation.item.id
        }
      }
    });

    for (const itemQuotation of itemQuotations) {
      if (itemQuotation.id !== quotation.id) {
        itemQuotation.status = STATUS_LIST.REJECTED;
        await quotationRepository.save(itemQuotation);
      }
    }

    return acceptedQuotation;
  } catch (error) {
    throw error;
  }
}

async function getAllQuotationBySupplier(supplierId) {
  const quotationRepository = getRepository(Quotation);

  try {
    const quotations = await quotationRepository.find({
      where: {
        supplier: supplierId
      },
      relations: ["item"]
    });

    return quotations;
  } catch (error) {
    throw error;
  }
}

export default {
  createQuotation,
  createListQuotation,
  updateQuotationStatus,
  acceptQuotation,
  deleteQuotation,
  deleteListQuotation,
  getAllQuotationBySupplier
};

