import Joi from "joi";

const createArtworkSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    slug: Joi.string().required(),
    visibility: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
    categoryId: Joi.string(),
    galleryId: Joi.string(),
    masterVersionId: Joi.string(),
});

const getArtworkByIdSlugSchema = Joi.object({
    id: Joi.string(),
    slug: Joi.string(),
});

const getArtworksSchema = Joi.object({
    page: Joi.number().default(1),
    limit: Joi.number().default(15),
    sort: Joi.number().default(-1),
    categoryId: Joi.string(),
    galleryId: Joi.string(),
    artistId: Joi.string(),
});

export { createArtworkSchema, getArtworkByIdSlugSchema, getArtworksSchema };