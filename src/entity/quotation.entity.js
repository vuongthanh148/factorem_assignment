import { EntitySchema } from "typeorm";

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
            default: 0.0
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
            inverseSide: "quotations"
        },
        user: {
            target: "User",
            type: "many-to-one",
            inverseSide: "quotations"
        }
    }
});