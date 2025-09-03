import { createArtwork, getArtworkByIdSlug, getArtworks } from "../controllers/artwork.controller.js";
import { hasArtistRole, verifyToken } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createArtworkSchema, getArtworkByIdSlugSchema, getArtworksSchema } from "../validations/artwork.schema.js";
import { Router } from "express";

const artworkRouter = Router();

artworkRouter.post("/create", verifyToken, hasArtistRole, validateRequest(createArtworkSchema), createArtwork);
artworkRouter.put("/get-by-id-slug", validateRequest(getArtworkByIdSlugSchema), getArtworkByIdSlug);
artworkRouter.put("/get-all", validateRequest(getArtworksSchema), getArtworks);

export default artworkRouter;