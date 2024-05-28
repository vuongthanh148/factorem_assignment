import { EntitySchema } from "typeorm";

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
      inverseSide: "projects"
    },
    items: {
      target: "Item",
      type: "one-to-many",
      inverseSide: "project"
    }
  }
});