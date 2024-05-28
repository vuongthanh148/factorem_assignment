import { EntitySchema } from "typeorm";
import { TOKEN_TYPE } from "../shared/constants/app.constant.js";

export default new EntitySchema({
  name: "Token",
  columns: {
    id: {
      primary: true,
      type: "varchar",
      length: 36,
      generated: 'uuid'
    },
    token: {
      type: "varchar",
      length: 255,
      nullable: false
    },
    userId: {
      type: "uuid",
      nullable: false
    },
    type: {
      type: "enum",
      enum: [TOKEN_TYPE.REFRESH],
      nullable: false
    },
    expires: {
      type: "timestamp",
      nullable: false
    }
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "userId" },
      inverseSide: "tokens"
    }
  }
});