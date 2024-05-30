import { EntitySchema } from "typeorm";
import { STATUS_LIST } from "../shared/constants/app.constant.js";

export default new EntitySchema({
  name: "Project",
  columns: {
    id: {
      primary: true,
      type: "varchar",
      generated: 'uuid'
    },
    name: {
      type: "varchar",
    },
    status: {
      type: "enum",
      enum: Object.values(STATUS_LIST),
      default: STATUS_LIST.PENDING
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
    user: {
      target: "User",
      type: "many-to-one",
      inverseSide: "projects",
    },
    items: {
      target: "Item",
      type: "one-to-many",
      inverseSide: "project",
    },
  }
});