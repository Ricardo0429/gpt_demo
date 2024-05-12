import httpStatus from 'http-status';
import { contentService } from '../services';

const addContents = (rawData) => {
  try {
    return contentService.addContent(rawData);
  } catch (error) {
    throw new Error(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const getContentsByUserId = (userId) => {
  try {
    return contentService.getContents(userId);
  } catch (error) {
    throw new Error(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

export default {
  addContents,
  getContentsByUserId,
};
