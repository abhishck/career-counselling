import User from "../models/User.js";

// ✅ Get Logged-in User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, password } = req.body;

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.default.genSalt(10);
      user.password = await bcrypt.default.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};