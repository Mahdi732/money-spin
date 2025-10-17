export const requireVerification = (req, res, next) => {
  const user = req.user; 
  if (!user.isVerified) {
    return res.status(403).json({
      message: "ou must verify your account before performing this action."
    });
  }
  next();
};
