import * as config from 'config';
import { uniq, concat, keyBy } from 'lodash/fp';
import {
  createNewEdgesUserToUser,
  findExistingEdgesUserToUser,
  followAgainByNextUsers,
  getAllFollowers,
  persistNewUsers, saveReport,
  unfollowByNextUsers,
} from '../service';
import { logger } from '../utils';

export const run = async () => {
  logger.info(`start_config: ${JSON.stringify(config)}`);

  try {
    const followers = await getAllFollowers();
    await persistNewUsers(followers);

    const existingEdgesUserToUser = await findExistingEdgesUserToUser();
    const existingEdgesUserToUserById = keyBy('subjectId', existingEdgesUserToUser);

    const followedBy = await createNewEdgesUserToUser(
      existingEdgesUserToUserById,
      followers,
    );
    const followedAgainBy = await followAgainByNextUsers(
      existingEdgesUserToUserById,
      followers,
    );
    const unfollowedBy = await unfollowByNextUsers(
      existingEdgesUserToUser,
      followers,
    );

    await saveReport(
      followers.length,
      uniq(concat(followedBy, followedAgainBy)),
      unfollowedBy,
    );

    logger.debug('done');
  } catch (e) {
    logger.error(e.message);
  }
};
