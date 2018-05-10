import * as config from 'config';
import {
  each,
  filter,
  flow,
  get,
  getOr,
  keyBy,
  map,
} from 'lodash/fp';

import { getLogger, syncSleep } from '../utils';
import {
  createEdgeUserToUser, createReportFollowing,
  createUsers,
  findEdgeUserToUser,
  findUsers,
  updateEdgeUserToUser,
} from '../repository';
import { getFollowers } from '../insta-client';

const logger = getLogger('service');
const userId = config.get('userId');

export const getAllFollowers = async () => {
  const followers = [];
  let hasNext = true;
  let hash = undefined;

  while (hasNext) {
    syncSleep(1);

    const data = await getFollowers(userId, hash);

    flow(
        get('edges'),
        each(x => followers.push(x)),
      )(data);

    hasNext = get(['page_info', 'has_next_page'], data);
    hash = get(['page_info', 'end_cursor'], data);

    logger.debug(`loading... ${followers.length}/${data.count}`);

    if (!hasNext) {
      logger.debug(`last hash: ${hash}`);
    }
  }

  logger.info(`number of followers: ${followers.length}`);

  return followers;
};

export const persistNewUsers = async (users) => {
  const usersIds = map('userId', users);
  const existingUsers = await findUsers({ userId: { $in: usersIds } }, 'userId');
  const existingUsersById = keyBy('userId', existingUsers);
  const newUsers = filter(x => !existingUsersById[x.userId], users);

  if (newUsers.length) {
    await createUsers(newUsers);

    each(x => logger.info(`new user: ${x.fullName}`), newUsers);
  }
};

export const createNewEdgesUserToUser = async (existingEdgesUserToUserById, followers) => {
  const newEdgesUserToUser = filter(x => !existingEdgesUserToUserById[x.userId], followers);
  const newUsers = map('userId', newEdgesUserToUser);

  if (newUsers.length) {
    const edges = map(x => ({
      hash: `${userId}:${x.userId}`,
      objectId: userId,
      subjectId: x.userId,
      following: {
        current: true,
        history: [{ event: 'follow' }],
      },
    }), newEdgesUserToUser);

    await createEdgeUserToUser(edges);

    logger.info(`followed by: ${newUsers}`);
  }

  return newUsers;
};

export const followAgainByNextUsers = async (existingEdgesUserToUserById, followers) => {
  const followedAgain = filter((x) => {
    const edge = existingEdgesUserToUserById[x.userId];

    return edge && !getOr(false, ['following', 'current'], edge);
  }, followers);

  const ids = map('userId', followedAgain);

  if (ids.length) {
    logger.info(`followed again by: ${ids}`);

    await updateEdgeUserToUser(
      { objectId: userId, subjectId: { $in: ids } },
      {
        $set: { modifiedAt: new Date(), 'following.current': true },
        $addToSet: { 'following.history': { event: 'follow' } },
      },
    );
  }

  return ids;
};

export const findExistingEdgesUserToUser = async () => {
  const result = await findEdgeUserToUser(
    { objectId: userId },
    { objectId: 1, subjectId: 1, 'following.history': { $slice: -1 } },
  );

  logger.info(`number of existing edges: ${result.length}`);

  return result;
};

export const unfollowByNextUsers = async (existingEdgesUserToUser, followers) => {
  const followersById = keyBy('userId', followers);
  const unfollowed = filter(
    x => x.following.current && !followersById[x.subjectId],
    existingEdgesUserToUser,
  );

  const ids = map('subjectId', unfollowed);

  if (ids.length) {
    logger.info(`unfollowed by: ${ids}`);

    await updateEdgeUserToUser(
      { objectId: userId, subjectId: { $in: ids }, 'following.current': true },
      {
        $set: { modifiedAt: new Date(), 'following.current': false },
        $addToSet: { 'following.history': { event: 'unfollow' } },
      },
    );
  }

  return ids;
};

export const saveReport = async (
  numberOfFollowers: number,
  followedBy: string[],
  unfollowedBy: string[],
) => {
  if (followedBy.length || unfollowedBy.length) {
    await createReportFollowing({
      followedBy,
      numberOfFollowers,
      unfollowedBy,
      userId,
    });
  } else {
    logger.info('no changes since last report');
  }
};
