import { Router } from "express";
import category from "./category";
import product from "./product";

const router = Router();

//BASE: /api

router.use("/category", category).use("/product", product);

export default router;
