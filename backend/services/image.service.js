import axios from 'axios';
import { Types } from 'mongoose';
import { Image } from '../models';
import moment from 'moment';

const generateImage = async (req, res) => {
  const data = JSON.stringify({
    key: 'G8sSXXiTmWbY7LFqZ9MqrzUIDE1ZQqL3MeVykjARGbzwKmgv7zb35NAcylY1',
    prompt: req.params.description + ', illustration' + buildDisplayStyles(req),
    negative_prompt: '',
    width: '512',
    height: '512',
    samples: '3',
    num_inference_steps: '30',
    seed: null,
    guidance_scale: 7.5,
    webhook: null,
    track_id: null,
  });

  const config = {
    method: 'post',
    url: 'https://stablediffusionapi.com/api/v3/text2img?key=G8sSXXiTmWbY7LFqZ9MqrzUIDE1ZQqL3MeVykjARGbzwKmgv7zb35NAcylY1',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  };

  try {
    return axios(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
    res.end();
  }
};

const uploadImage = async (req) => {
  try {
    const { imgUrl, prompt, tag } = req.body;
    const newEntry = new Image();
    const userId = Types.ObjectId(req.user._id);
    const user = await Image.findOne({ user: userId });
    if (user) {
      user.uploads.push({ url: imgUrl, prompt, tag });
      return user.save();
    } else {
      newEntry.user = userId;
      newEntry.uploads.push({ url: imgUrl, prompt, tag });
      return newEntry.save();
    }
  } catch (error) {
    throw error;
  }
};

const groupByDate = (imageList) => {
  const tempImagesByDate = imageList.reduceRight(function (list, elems) {
    const splitedDate = moment(elems['date']).format('MMMM Do, YYYY');
    if (!list[splitedDate]) {
      list[splitedDate] = [];
    }
    list[splitedDate].push(elems);
    return list;
  }, {});
  return tempImagesByDate;
};

const getImagesByUserId = async (userId) => {
  const entity = await Image.findOne({ user: userId });
  if (!entity) {
    return [];
  }
  return entity.uploads;
};

const getAllUniqueTags = async (images) => {
  var uniqueAllTags = [];
  var filteredAllImages = [];
  const allTags = images.map((image) => image.tag);
  for (let i = 0; i < allTags.length; i++) {
    uniqueAllTags = [...new Set([...uniqueAllTags, ...allTags[i].filter((t) => t != '')])];
  }
  for (let i = 0; i < uniqueAllTags.length; i++) {
    var filteredImages = images.filter((image) => image.tag.includes(uniqueAllTags[i]));
    filteredAllImages.push({ tag: uniqueAllTags[i], count: filteredImages.length });
  }
  return filteredAllImages;
};

const updateImageById = async (req) => {
  const {
    params: { id: imageId },
    user: { _id: userId },
    body: { tag },
  } = req;
  const entity = await Image.findOne({ user: Types.ObjectId(userId) });
  entity.uploads = entity.uploads.map((upload) => {
    if (upload._id == imageId) {
      upload.tag = tag;
    }
    return upload;
  });
  await entity.save();
  return entity.uploads;
};

const updateTag = async (req) => {
  const {
    params: { id: imageId },
    user: { _id: userId },
    body: { tag },
  } = req;
  const entity = await Image.findOne({ user: Types.ObjectId(userId) });
  entity.uploads = entity.uploads.map((upload) => {
    if (upload._id == imageId) {
      upload.tag = tag;
    }
    return upload;
  });
  await entity.save();
  return entity.uploads;
};

const deleteImageById = async (userData) => {
  const {
    params: { id: imageId },
    user: { _id: userId },
  } = userData;
  const entity = await Image.findOne({ user: Types.ObjectId(userId) });
  const updatedImages = entity.uploads.filter(({ _id }) => _id != imageId);
  entity.uploads = updatedImages;
  await entity.save();
  return entity.uploads;
};

const filterImagesByTag = async (images, tag) => {
  return tag === 'All' ? images : images.filter((image) => image.tag.includes(tag));
};

const buildDisplayStyles = (request) => {
  let displayStyles = '';

  if (request.params.isFantasy === 'true') {
    console.log(`isFantasy: ${request.params.isFantasy}`);
    displayStyles += ', fantasy';
  }

  if (request.params.isAnime === 'true') {
    console.log(`isAnime: ${request.params.isAnime}`);
    displayStyles += ', anime';
  }

  if (request.params.isPencil === 'true') {
    console.log(`isPencil: ${request.params.isPencil}`);
    displayStyles += ', pencil';
  }

  if (request.params.isNouveau === 'true') {
    console.log(`isNouveau: ${request.params.isNouveau}`);
    displayStyles += ', art nouveau';
  }

  if (request.params.isWatercolor === 'true') {
    console.log(`isWatercolor: ${request.params.isWatercolor}`);
    displayStyles += ', watercolor, watercolour';
  }

  if (request.params.isDeco === 'true') {
    console.log(`isDeco: ${request.params.isDeco}`);
    displayStyles += ', art deco';
  }

  if (request.params.isAcrylic === 'true') {
    console.log(`isAcrylic: ${request.params.isAcrylic}`);
    displayStyles += ', acrylic painting';
  }

  console.log('displayStyles', displayStyles);
  return displayStyles;
};

export default {
  generateImage,
  groupByDate,
  uploadImage,
  getImagesByUserId,
  getAllUniqueTags,
  updateImageById,
  deleteImageById,
  filterImagesByTag,
};
