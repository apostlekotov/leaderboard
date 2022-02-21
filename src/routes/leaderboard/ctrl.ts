import { Request, Response } from "express";
import {
  FindManyOptions,
  getConnection,
  MoreThan,
  MoreThanOrEqual,
} from "typeorm";
import { User } from "../../entities/User";

const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;
    const limit = req.query.limit || 25;
    // const page = req.query.page || 1;

    const options: FindManyOptions<User> = {
      take: +limit,
      // skip: +limit * (+page - 1),
      order: { score: "DESC", username: "DESC" },
    };

    const [leaderboard] = await User.findAndCount(options);

    if (
      leaderboard.length > 0 &&
      !leaderboard.find(({ id }) => id === user.id)
    ) {
      const userLeaderboardPlace = await User.count({
        where: { score: MoreThanOrEqual(user.score) },
        order: { score: "DESC", username: "DESC" },
      });

      return res.status(200).json({
        isSuccess: true,
        leaderboard,
        chunk: [{ ...user, userLeaderboardPlace }],
        // page,
      });
    }

    return res.status(200).json({
      isSuccess: true,
      leaderboard,
      chunk: [],
      // page,
    });
  } catch (err) {
    console.error(`Error: ${err}`.red);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

const getLeaders = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit || 3;

    const [leaderboard] = await User.findAndCount({
      take: +limit,
      where: { pb: MoreThan(0) },
      order: { pb: "DESC" },
      select: ["id", "username", "country", "score", "pb"],
    });

    return res.status(200).json({ isSuccess: true, leaderboard });
  } catch (err) {
    console.error(`Error: ${err}`.red);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

const clearLeaderboard = async (_: Request, res: Response) => {
  try {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ score: 0 })
      .execute();

    return res.status(200).json({
      isSuccess: true,
      message: "Leaderboard was successfully cleared",
    });
  } catch (err) {
    console.error(`Error: ${err}`.red);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

const clearLeaders = async (_: Request, res: Response) => {
  try {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ pb: 0, score: 0 })
      .execute();

    return res.status(200).json({
      isSuccess: true,
      message: "Leaderboard and leaders was successfully cleared",
    });
  } catch (err) {
    console.error(`Error: ${err}`.red);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

export default { getLeaderboard, getLeaders, clearLeaderboard, clearLeaders };
