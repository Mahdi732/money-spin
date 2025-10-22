import ContributionRound from "../Models/Contribution.js";
import Group from "../Models/Group.js";
import Notification from "../Models/Notification.js";

export default class ContributionService {

  static async createRound(groupId) {
    const group = await Group.findById(groupId).populate("members");
    if (!group) throw new Error("Group not found");

    const previousRounds = await ContributionRound.countDocuments({ group: groupId });
    const roundNumber = previousRounds + 1;

    const receiver = group.members[previousRounds % group.members.length];

    const contributions = group.members.map(m => ({
      member: m._id,
      amount: group.amountPerRound,
      paid: false
    }));

    const round = await ContributionRound.create({
      group: groupId,
      roundNumber,
      receiver,
      contributions
    });

    const notifications = group.members.map(m => ({
      user: m._id,
      message: `New round #${roundNumber} has started. Please make your payment.`
    }));
    await Notification.insertMany(notifications);

    return round;
  }

  static async getGroupHistory(groupId, userId) {
    const group = await Group.findById(groupId).populate("members");
    if (!group) throw new Error("Group not found");

    const isMember = group.members.some(m => m._id.toString() === userId.toString());
    if (!isMember) throw new Error("You are not a member of this group");

    const rounds = await ContributionRound.find({ group: groupId })
      .populate("receiver", "full_name email")
      .populate("contributions.member", "full_name email")
      .sort({ createdAt: -1 });

    return rounds;
  }

  static async payContribution(roundId, userId) {
    const round = await ContributionRound.findById(roundId);
    if (!round) throw new Error("ROUND NOT FOUND");

    const contrib = round.contributions.find(c => c.member.toString() === userId.toString());
    if (!contrib) throw new Error("USER NOT IN THIS ROUND");
    if (contrib.paid) throw new Error("ALREADY PAID");

    contrib.paid = true;
    contrib.paidAt = new Date();
    round.totalAmount += contrib.amount;

    await round.save();
    return round;
  }

  static async distributeFunds(roundId) {
    const round = await ContributionRound.findById(roundId).populate("receiver");
    if (!round) throw new Error("ROUND NOT FOUND");

    const allPaid = round.contributions.every(c => c.paid);
    if (!allPaid) throw new Error("NOT ALL MEMBERS PAID YET");

    round.isDistributed = true;
    round.distributedAt = new Date();
    await round.save();

    return {
      message: `Funds of ${round.totalAmount} distributed to ${round.receiver.full_name}`,
      round
    };
  }
}
