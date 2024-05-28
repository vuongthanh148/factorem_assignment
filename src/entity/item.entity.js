import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Item",
  columns: {
    id: {
      primary: true,
      type: "varchar",
      generated: 'uuid'
    },
    name: {
      type: "varchar",
    },
    technology: {
      type: "varchar",
      default: "CNC Machining"
    },
    material: {
      type: "varchar",
      default: "Aluminum 6061"
    },
    surfaceFinish: {
      type: "varchar",
      default: "Anodizing Type II"
    },
    quantity: {
      type: "int",
      default: 1
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
    project: {
      target: "Project",
      type: "many-to-one",
      inverseSide: "items"
    },
    quotations: {
      target: "Quotation",
      type: "one-to-many",
      inverseSide: "item"
    }
  }
});