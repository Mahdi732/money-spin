import * as ContributionService from "../Services/ContributionService.js";

export const createRound = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const round = await ContributionService.createRound(groupId);
    res.status(201).json({ success: true, round });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const payContribution = async (req, res) => {
  try {
    const round = await ContributionService.payContribution(req.params.roundId, req.user.id);
    res.json(round);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const distributeFunds = async (req, res) => {
  try {
    const result = await ContributionService.distributeFunds(req.params.roundId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
