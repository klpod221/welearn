import api from "@/lib/api";

export const getAll = async () => {
  return await api.get("/settings");
};

export const getById = async (id) => {
  return await api.get(`/settings/${id}`);
}

export const create = async (data) => {
  return await api.post("/settings", data);
}

export const update = async (id, data) => {
  return await api.put(`/settings/${id}`, data);
}

export const remove = async (id) => {
  return await api.delete(`/settings/${id}`);
}
