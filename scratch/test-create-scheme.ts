import { connectDB } from "../src/lib/db/mongoose";
import User from "../src/models/User";
import Scheme from "../src/models/Scheme";
import Notification from "../src/models/Notification";
import { createScheme } from "../src/services/scheme.service";

async function run() {
  await connectDB();
  console.log("Connected to DB");

  const testTitle = "Test Scheme " + Date.now();
  const testSlug = "test-scheme-" + Date.now();

  const data = {
    title: testTitle,
    slug: testSlug,
    shortDescription: "A temporary test scheme description.",
    description: "Detailed description of the test scheme.",
    category: "Education" as any,
    ministry: "Ministry of Education",
    officialUrl: "https://example.com",
    status: "Active" as any,
    benefits: [],
    documents: [],
    tags: [],
    states: []
  };

  console.log("Creating scheme...");
  const scheme = await createScheme(data);
  console.log("Created scheme:", scheme.title, "_id:", scheme._id);

  console.log("Fetching users...");
  const users = await User.find({}, "_id").lean();
  console.log(`Found ${users.length} users.`);

  if (users.length > 0) {
    console.log("Inserting notifications...");
    const notifications = users.map((user: any) => ({
      userId: user._id,
      title: "New Scheme Added",
      message: `${scheme.title} has been added.`,
      type: "new_scheme" as any,
      schemeId: scheme._id,
    }));
    const insertResult = await Notification.insertMany(notifications);
    console.log(`Inserted ${insertResult.length} notifications.`);
  }

  // Cleanup test scheme
  await Scheme.deleteOne({ _id: scheme._id });
  console.log("Cleaned up test scheme");

  // Cleanup test notifications
  const deletedNotifications = await Notification.deleteMany({ schemeId: scheme._id });
  console.log(`Cleaned up ${deletedNotifications.deletedCount} notifications.`);

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
