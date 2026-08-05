import { connectDB } from "../src/lib/db/mongoose";
import User from "../src/models/User";
import Scheme from "../src/models/Scheme";
import Notification from "../src/models/Notification";

async function run() {
  await connectDB();
  console.log("Connected to DB");
  
  const userCount = await User.countDocuments();
  console.log("User count:", userCount);
  
  const users = await User.find({}, "_id").lean();
  console.log("Users:", users);

  const schemeCount = await Scheme.countDocuments();
  console.log("Scheme count:", schemeCount);

  const notificationCount = await Notification.countDocuments();
  console.log("Notification count:", notificationCount);
  
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
