import { v4 as uuidv4 } from "uuid";
import { EmployeeRepository } from "../repositories/employee.repository.js";

const repo = new EmployeeRepository();

export class EmployeeUseCase {
  async list() {
    try {
      return await repo.getAll();
    } catch (err) {
      throw new Error("failed-to-list-employees");
    }
  }

  async get(id) {
    try {
      const employee = await repo.getById(id);
      if (!employee) throw new Error("employee-not-found");
      return employee;
    } catch (err) {
      throw new Error("failed-to-get-employee");
    }
  }

  async create(payload) {
    if (!payload?.name) throw new Error("name-required");
    // Optionally validate role here
    const item = {
      id: uuidv4(),
      name: payload.name,
      role: payload.role || null,
      createdAt: new Date().toISOString(),
    };
    try {
      return await repo.create(item);
    } catch (err) {
      throw new Error("failed-to-create-employee");
    }
  }

  async update(id, payload) {
    if (!payload) throw new Error("payload-required");
    // Only allow certain fields to be updated
    const allowed = ["name", "role"];
    const patch = Object.fromEntries(
      Object.entries(payload).filter(([k]) => allowed.includes(k))
    );
    if (Object.keys(patch).length === 0) throw new Error("no-valid-fields-to-update");
    try {
      const updated = await repo.update(id, patch);
      if (!updated) throw new Error("employee-not-found");
      return updated;
    } catch (err) {
      throw new Error("failed-to-update-employee");
    }
  }

  async remove(id) {
    try {
      const success = await repo.delete(id);
      if (!success) throw new Error("employee-not-found");
      return { success };
    } catch (err) {
      throw new Error("failed-to-remove-employee");
    }
  }
}
