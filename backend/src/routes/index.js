import {
  createHandler,
  deleteHandler,
  getHandler,
  listHandler,
  updateHandler
} from "../controllers/employee.controller.js";

const employeeSchema = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string" },
      role: { type: ["string", "null"] }
    }
  },
  params: {
    type: "object",
    properties: {
      id: { type: "string" }
    }
  }
};

export default async function routes(fastify) {
  fastify.get("/employees", { schema: { tags: ["Employee"] } }, listHandler);
  fastify.get(
    "/employees/:id",
    { schema: { params: employeeSchema.params, tags: ["Employee"] } },
    getHandler
  );
  fastify.post(
    "/employees",
    { schema: { body: employeeSchema.body, tags: ["Employee"] } },
    createHandler
  );
  fastify.put(
    "/employees/:id",
    {
      schema: {
        body: employeeSchema.body,
        params: employeeSchema.params,
        tags: ["Employee"]
      }
    },
    updateHandler
  );
  fastify.delete(
    "/employees/:id",
    { schema: { params: employeeSchema.params, tags: ["Employee"] } },
    deleteHandler
  );
}
