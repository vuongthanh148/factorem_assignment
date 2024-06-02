import { EntitySchema } from "typeorm";
import { ROLE_ENUM } from "../shared/config/roles.js";

export default new EntitySchema({
  name: "User",
  columns: {
    id: {
      primary: true,
      type: "varchar",
      generated: 'uuid'
    },
    username: {
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
    role: {
      type: "enum",
      enum: ROLE_ENUM,
      default: ROLE_ENUM.CUSTOMER
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
    projects: {
      target: "Project",
      type: "one-to-many",
      inverseSide: "user"
    }
  }
});