import * as mongoose from 'mongoose';
import * as config from 'config';

import {
  EdgeUserToUser,
  ReportFollowing,
  User,
} from './dtos';

const mongoUrl = config.get('mongoUrl');
const mongoDb = config.get('mongoDb');

mongoose.connect(`${mongoUrl}/${mongoDb}`);

export const closeConnection = () => mongoose.disconnect();

export const createUsers = data =>
  User.create(data, (err, users) =>
    new Promise((resolve, reject) => err ? reject(err) : resolve(users)));

export const findUsers = (criteria, extra?) =>
  User.find(criteria, extra, (err, users) =>
    new Promise((resolve, reject) => err ? reject(err) : resolve(users)));

export const createEdgeUserToUser = data =>
  EdgeUserToUser.create(data, (err, users) =>
    new Promise((resolve, reject) => err ? reject(err) : resolve(users)));

export const updateEdgeUserToUser = (data, extra?) =>
  EdgeUserToUser.update(data, extra, { multi:true }, (err, users) =>
    new Promise((resolve, reject) => err ? reject(err) : resolve(users)));

export const findEdgeUserToUser = (criteria, extra?) =>
  EdgeUserToUser.find(criteria, extra, (err, users) =>
    new Promise((resolve, reject) => err ? reject(err) : resolve(users)));

export const createReportFollowing = data =>
  ReportFollowing.create(data, (err, users) =>
    new Promise((resolve, reject) => err ? reject(err) : resolve(users)));
