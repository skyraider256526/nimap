import { Request, Response, Router } from "express";
import prisma from "../services/db";

const router = Router();

/**
 * @route GET /api/category
 * @desc Picks all the category.
 */
router.get("/", async (_req: Request, res: Response) => {
  const result = await prisma.category.findMany();
  res.json({ result });
});

/**
 * @route POST /api/category
 * @body {name:string}
 * @desc Creates a category.
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.create({ data: req.body });
    console.log(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Category exists" });
  }
});

/**
 * @route PUT /api/category/:id
 * @body {name:string}
 * @desc Updates a category.
 */
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    console.log(req.body);
    res.status(201).end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Something went wrong" });
  }
});

/**
 * @route DDELETE /api/category/:id
 * @desc Deletes a category.
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Deleting products first, because cascade delete not supported in prisma
    await prisma.product.deleteMany({ where: { categoryId: parseInt(id) } });
    const category = await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Something went wrong" });
  }
});

export default router;
