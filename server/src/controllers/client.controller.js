import Client from "../models/Client.js";
import { clientSchema } from "../validations/client.schema.js";

export const createClient = async (req, res) => {
  const parsed = clientSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json(parsed.error.format());
  }

  const client = await Client.create({
    ...parsed.data,
    user: req.user._id, // 🔥 Use req.user._id
  });

  res.status(201).json(client);
};

export const getClients = async (req, res) => {
  const clients = await Client.find({ user: req.user._id }).sort("-createdAt"); // 🔥 Fix
  res.json(clients);
};

export const getClient = async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    user: req.user._id, // 🔥 Fix
  });

  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }

  res.json(client);
};

export const updateClient = async (req, res) => {
  const parsed = clientSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json(parsed.error.format());
  }

  const client = await Client.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id }, // 🔥 Fix
    parsed.data,
    { new: true }
  );

  res.json(client);
};

export const deleteClient = async (req, res) => {
  await Client.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id, // 🔥 Fix
  });

  res.json({ message: "Client deleted" });
};
