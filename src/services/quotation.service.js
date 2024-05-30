/* eslint-disable no-magic-numbers */
import { getRepository } from 'typeorm';
import Item from '../entity/item.entity.js';
import Quotation from '../entity/quotation.entity.js';
import { STATUS_LIST } from '../shared/constants/app.constant.js';
import { ErrorCode, ErrorMessage } from '../shared/constants/error.constant.js';
import { CustomError } from '../utils/custom-error.js';


async function createQuotation(itemId, quotationBody, userId) {
  const quotationRepository = getRepository(Quotation);
  const itemRepository = getRepository(Item);

  try {
    const item = await itemRepository.findOne({ where: { id: itemId, status: STATUS_LIST.APPROVED } });
    if (!item) {
      throw new CustomError({ code: ErrorCode.ITEM_NOT_FOUND, message: ErrorMessage.ITEM_NOT_FOUND });
    }

    const createdQuotation = await quotationRepository.save({ ...quotationBody, item, supplier: userId });

    return createdQuotation;
  } catch (error) {
    throw error;
  }
}

async function approveQuotation(quotationId) {
  const quotationRepository = getRepository(Quotation);

  try {
    const quotation = await quotationRepository.findOne({
      where: {
        id: quotationId,
        item: { status: STATUS_LIST.APPROVED }
      },
      relations: ["item"]
    });

    if (!quotation) {
      throw new CustomError({ code: '400004', message: 'Quotation not found!' });
    }

    if (quotation.status == STATUS_LIST.APPROVED) {
      throw new CustomError({ code: '400004', message: 'Quotation already approved!', data: quotation });
    }
    quotation.status = STATUS_LIST.APPROVED;
    const approvedQuotation = await quotationRepository.save(quotation);

    return approvedQuotation;
  } catch (error) {
    throw error;
  }
}

async function acceptQuotation(quotationId) {
  const quotationRepository = getRepository(Quotation);

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

    return acceptedQuotation;
  } catch (error) {
    throw error;
  }
}


export default {
  createQuotation,
  approveQuotation,
  acceptQuotation
};
