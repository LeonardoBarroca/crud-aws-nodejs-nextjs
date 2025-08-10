import { EmployeeUseCase } from "../use_cases/employee.usecase.js";
const usecase = new EmployeeUseCase();

export async function listHandler(request, reply) {
  try {
    const items = await usecase.list();
    return reply.send(items);
  } catch (err) {
    return reply.code(500).send({ error: err.message });
  }
}

export async function getHandler(request, reply) {
  try {
    const { id } = request.params;
    const item = await usecase.get(id);
    if (!item) return reply.code(404).send({ error: "Not found" });
    return reply.send(item);
  } catch (err) {
    return reply.code(500).send({ error: err.message });
  }
}

export async function createHandler(request, reply) {
  try {
    const created = await usecase.create(request.body);
    return reply.code(201).send(created);
  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
}

export async function updateHandler(request, reply) {
  try {
    const { id } = request.params;
    const updated = await usecase.update(id, request.body);
    if (!updated) return reply.code(404).send({ error: "Not found" });
    return reply.send(updated);
  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
}

export async function deleteHandler(request, reply) {
  try {
    const result = await usecase.remove(request.params.id);
    if (!result.success) return reply.code(404).send({ error: "Not found" });
    return reply.code(204).send();
  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
}
