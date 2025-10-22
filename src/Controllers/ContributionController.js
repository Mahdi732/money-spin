import ContributionService from "../Services/ContributionService.js";

export default class ContributionController {
  static async createRound(req, res) {
    try {
      const round = await ContributionService.createRound(req.params.groupId);
      res.status(201).json({ success: true, round });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async payContribution(req, res) {
    try {
      const round = await ContributionService.payContribution(req.params.roundId, req.user.id);
      res.json(round);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getGroupHistory(req, res) {
    try {
      const rounds = await ContributionService.getGroupHistory(req.params.groupId, req.user.id);
      res.json({ success: true, rounds });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async distributeFunds(req, res) {
    try {
      const result = await ContributionService.distributeFunds(req.params.roundId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
