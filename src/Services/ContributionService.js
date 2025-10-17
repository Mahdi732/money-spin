import ContributionRound from "../Models/Contribution.js";
import Group from "../Models/Group.js";
import Notification from "../Models/Notification.js";

export const createRound = async (groupId) => {
  const group = await Group.findById(groupId).populate("members");
  if (!group) throw new Error("Group not found");

  const previousRounds = await ContributionRound.countDocuments({ group: groupId });
  const roundNumber = previousRounds + 1;

  const receiver = group.members[previousRounds % group.members.length];

  const contributions = group.members.map(m => ({
    member: m._id,
    amount: group.contributionAmount,
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
};

export const payContribution = async (roundId, userId) => {
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
};

export const distributeFunds = async (roundId) => {
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
};
