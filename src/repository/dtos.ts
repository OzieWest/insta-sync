const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// tslint:disable-next-line variable-name
const DateType = mongoose.Schema.Types.Date;

// tslint:disable-next-line variable-name
export const ReportFollowing = mongoose.model('report_following',
  new Schema({
    createdAt: { type: DateType, default: new Date() },
    userId: { type: String, required: true },
    numberOfFollowers: { type: Number, required: true },
    followedBy: [String],
    unfollowedBy: [String],
    isRead: { type: Boolean, default: false },
  }),
);

// tslint:disable-next-line variable-name
export const User = mongoose.model('user',
  new Schema({
    createdAt: { type: DateType, default: new Date() },
    fullName: String,
    modifiedAt: { type: DateType, default: null },
    profilePicUrl: String,
    userId: { type: String, unique: true },
    username: { type: String, required: true },
    tags: { type: [String], default: [] },
  }),
);

// tslint:disable-next-line variable-name
export const EdgeUserToUser = mongoose.model('edge_user_to_user',
  new Schema({
    createdAt: { type: DateType, default: new Date() },
    hash: { type: String, unique: true },
    modifiedAt: { type: DateType, default: null },
    objectId: { type: String, required: true },
    subjectId: { type: String, required: true },
    following: {
      current: { type: Boolean, default: false },
      history: [{
        createdAt: { type: DateType, default: new Date() },
        event: { type: String, required: true },
      }],
    },
  }),
);
