import Group from "../Models/Group.js";

export const createGroup = async (userId, data) => {
  try {
    const { name, contributionAmount } = data;
    const group = await Group.create({
      name,
    contributionAmount,
    createdBy: userId,
    members: [userId],
    });

    return { message: "GROUP IS CREATED BY SUCCESS", group };
  } catch (err) {
    return { message: "CREATION ERROR 444", error: err.message };
  }
};

export const getUserGroups = async (userId) => {
  return await Group.find({ members: userId })
    .populate("createdBy", "full_name email");
};

export const joinGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");

  if (group.members.includes(userId)) {
    throw new Error(" You are already a member in this group");
  }

  group.members.push(userId);
  await group.save();
  return group;
};

export const updateGroup = async (groupId, userId, updates) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");

  if (group.createdBy.toString() !== userId.toString()) {
    throw new Error(" You are not allowed to update this group");
  }

  Object.assign(group, updates);
  await group.save();
  return group;
};

export const deleteGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");

  if (group.createdBy.toString() !== userId.toString()) {
    throw new Error(" You are not allowed to delete this group");
  }

  await group.deleteOne();
  return { message: " Group deleted successfully" };
};
