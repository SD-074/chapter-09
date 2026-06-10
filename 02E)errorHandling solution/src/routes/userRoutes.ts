import { Router } from 'express';
import { createUser, deleteUser, getUsers, getUserById, updateUser } from '#controllers';

const userRoutes = Router();

userRoutes.route('/').get(getUsers).post(createUser);

userRoutes.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default userRoutes;
