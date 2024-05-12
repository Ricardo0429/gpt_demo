import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync';
import { imageService, userService } from '../services';

const generateImage = catchAsync(async (req, res) => {
  const { data } = await imageService.generateImage(req, res);
  res.status(httpStatus.CREATED).json(data);
});

const uploadImage = catchAsync(async (req, res) => {
  const images = await imageService.uploadImage(req);
  res.send({ msg: 'Succeed', images });
});

const getImagesByUsername = catchAsync(async (req, res) => {
  const { _id: userId } = await userService.getUserByUsername(req.params.username);
  const allImages = await imageService.getImagesByUserId(userId);
  const images = imageService.groupByDate(allImages);
  const filteredTags = await imageService.getAllUniqueTags(allImages);
  res.json({ userId: userId, image: images, filter: filteredTags });
});

const updateImageById = catchAsync(async (req, res) => {
  const allImages = await imageService.updateImageById(req);
  const images = imageService.groupByDate(await imageService.filterImagesByTag(allImages, req.params.tag));
  const updatedTags = await imageService.getAllUniqueTags(allImages);
  res.json({ image: images, filter: updatedTags });
});

const deleteImageById = catchAsync(async (req, res) => {
  const allImages = await imageService.deleteImageById(req);
  const images = imageService.groupByDate(await imageService.filterImagesByTag(allImages, req.params.tag));
  const filteredTags = await imageService.getAllUniqueTags(allImages);
  res.json({ image: images, filter: filteredTags });
});

const filterImagesByTag = catchAsync(async (req, res) => {
  const allImages = await imageService.getImagesByUserId(req.user._id);
  const images = imageService.groupByDate(await imageService.filterImagesByTag(allImages, req.params.tag));
  res.json({ images });
});

export default {
  generateImage,
  uploadImage,
  getImagesByUsername,
  updateImageById,
  deleteImageById,
  filterImagesByTag,
};
