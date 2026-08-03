import User, { IUser } from "@/models/User";

export async function getUserByEmail(email: string) {
  return await User.findOne({ email }).lean();
}

export async function createUser(data: Partial<IUser>) {
  return await User.create(data);
}

type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: "user" | "admin";
};

export async function getUsers({
  page = 1,
  limit = 10,
  search,
  role,
}: GetUsersParams) {
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (role) {
    filter.role = role;
  }

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}