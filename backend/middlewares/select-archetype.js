import { getUserById } from '../services/user.service';

export const selectArchetype = async (req, res, next) => {
  const user = await getUserById(req.user._id);

  const { archetype } = user;
  if (archetype != null) {
    req.archetype = archetype;
  }
  next();
};
