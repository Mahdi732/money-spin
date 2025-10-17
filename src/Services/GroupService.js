import Group from "../Models/Group.js";

export default class GroupService {
  static async createGroup(userId, data) {
    const { name, amountPerRound, roundDurationDays } = data;

    const group = await Group.create({
      name,
      amountPerRound,
      roundDurationDays,
      creator: userId,
      members: [userId],
    });

    return group;
  }

  static async getUserGroups(userId) {
    return await Group.find({ members: userId }).populate("creator", "full_name email");
  }

  static async joinGroup(groupId, userId) {
    const group = await Group.findById(groupId);
    if (!group) throw new Error("Group not found");

    if (group.members.includes(userId)) {
      throw new Error("You are already a member of this group");
    }

    group.members.push(userId);
    await group.save();
    return group;
  }

  static async updateGroup(groupId, userId, updates) {
    const group = await Group.findById(groupId);
    if (!group) throw new Error("Group not found");

    if (group.creator.toString() !== userId.toString()) {
      throw new Error("You are not allowed to update this group");
    }

    Object.assign(group, updates);
    await group.save();
    return group;
  }

  static async deleteGroup(groupId, userId) {
    const group = await Group.findById(groupId);
    if (!group) throw new Error("Group not found");

    if (group.creator.toString() !== userId.toString()) {
      throw new Error("You are not allowed to delete this group");
    }

    await group.deleteOne();
    return { message: "Group deleted successfully" };
  }
}
