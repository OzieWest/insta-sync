import axios from 'axios';
import * as config from 'config';
import { get, flow, map } from 'lodash/fp';

const sessionId = config.get('sessionId');
const proxyHost = config.get('proxyHost');

const SIZE = 50;

export const getFollowers = (userId, hash) => axios
  .post(
    `${proxyHost}/api/user/${userId}/followers`,
    { sessionId, first: SIZE, after: hash },
  )
  .then((resp) => {
    const data = get(['data', 'data'], resp);

    const edges = flow(
      get('edges'),
      map(x => ({
        fullName: get('full_name', x),
        profilePicUrl: get('profile_pic_url', x),
        userId: get('id', x),
        username: get('username', x),
      })),
    )(data);

    return { ...data, edges };
  });
