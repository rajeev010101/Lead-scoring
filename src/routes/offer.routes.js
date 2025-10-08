import express from 'express';
import { createOffer, getOffer } from '../controllers/offer.controller.js';
import { validateBody } from '../middlewares/validate.js';
import Joi from 'joi';

const router = express.Router();

const offerSchema = Joi.object({
  name: Joi.string().required(),
  value_props: Joi.array().items(Joi.string()).required(),
  ideal_use_cases: Joi.array().items(Joi.string()).required()
});

router.post('/', validateBody(offerSchema), createOffer);
router.get('/', getOffer);

export default router;
