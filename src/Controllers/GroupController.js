import * as GroupService from "../Services/GroupService.js";

export const createGroup = async (req, res) => {
  try {
    const group = await GroupService.createGroup(req.user.id, req.body);
    res.status(201).json({ message: "Group created successfully", group });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const groups = await GroupService.getUserGroups(req.user.id);
    res.json(groups);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const group = await GroupService.joinGroup(req.params.id, req.user.id);
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const group = await GroupService.updateGroup(req.params.id, req.user.id, req.body);
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const result = await GroupService.deleteGroup(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
