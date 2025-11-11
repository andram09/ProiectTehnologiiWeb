import express from 'express';
export const router=express.Router();
import {controllers} from '../controllers/index.js'

router.get('/user/:id',controllers.userController.getUserById)
router.get('/users',controllers.userController.getAllUsers)
router.get('/reviewers',controllers.userController.getAllReviewers);
router.put('/user/:id',controllers.userController.updateUser)
router.delete('/user/:id',controllers.userController.deleteUserById)