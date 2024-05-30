import { EntitySchema } from "typeorm";
import { STATUS_LIST } from "../shared/constants/app.constant.js";

export default new EntitySchema({
    name: "Quotation",
    columns: {
        id: {
            primary: true,
            type: "varchar",
            generated: 'uuid'
        },
        price: {
            type: "decimal",
        },
        status: {
            type: "enum",
            enum: Object.values(STATUS_LIST),
            default: STATUS_LIST.PENDING
        },
        technology: {
            type: "varchar",
        },
        material: {
            type: "varchar",
        },
        surfaceFinish: {
            type: "varchar",
        },
        quantity: {
            type: "int",
        },
        createdAt: {
            type: "timestamp",
            createDate: true
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true
        }
    },
    relations: {
        item: {
            target: "Item",
            type: "many-to-one",
            inverseSide: "quotations",
        },
        supplier: {
            target: "User",
            type: "many-to-one",
        },
    }
});