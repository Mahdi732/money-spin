import GroupService from "../Services/GroupService.js";

export default class GroupController {
  static async createGroup(req, res) {
    try {
      const group = await GroupService.createGroup(req.user.id, req.body);
      res.status(201).json({ message: "Group created successfully", group });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getMyGroups(req, res) {
    try {
      const groups = await GroupService.getUserGroups(req.user.id);
      res.json(groups);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async joinGroup(req, res) {
    try {
      const group = await GroupService.joinGroup(req.params.id, req.user.id);
      res.json(group);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateGroup(req, res) {
    try {
      const group = await GroupService.updateGroup(req.params.id, req.user.id, req.body);
      res.json(group);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deleteGroup(req, res) {
    try {
      const result = await GroupService.deleteGroup(req.params.id, req.user.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
