import { Prisma } from ".prisma/client";
import { Request, Response, Router } from "express";
import prisma from "../services/db";

const router = Router();

async function paginatedProducts(
  req: Request,
  filter: Prisma.ProductWhereInput = {}
) {
  const { l, p } = req.query;
  if (Array.isArray(l) || Array.isArray(p)) {
    return -1;
  }

  const limit = parseInt(l as string) || 10,
    page = parseInt(p as string) || 1;
  console.log(limit, page);
  try {
    const count = await prisma.product.count({ where: filter }),
      skip =
        page > Math.ceil(count / limit)
          ? limit * (Math.ceil(count / limit) - 1)
          : limit * (page - 1),
      products = await prisma.product.findMany({
        skip,
        take: limit,
        where: filter,
        orderBy: { createdAt: "desc" },
      });
    console.log(skip);
    return { products, count };
  } catch (error) {
    console.error(error);
    return -1;
  }
}

/**
 * @route GET /api/product/?l=number,p=number
 * @desc Picks all the product which are paginated.
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await paginatedProducts(req);
    res.json(data);
  } catch (error) {
    res.json(400).end();
  }
});

/**
 * @route GET /api/product/:categoryId/?l=number,p=umber
 * @desc Picks all the product of specific categoryId.
 */
router.get("/:categoryId", async (req: Request, res: Response) => {
  try {
    const products = await paginatedProducts(req, {
      categoryId: parseInt(req.params.categoryId),
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Something went wrong" });
  }
});

/**
 * @route POST /api/product
 * @body {name:string,categoryId:number}
 * @desc Creates a product of specific category.
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, categoryId } = req.body;
    const product = await prisma.product.create({
      data: { name, category: { connect: { id: parseInt(categoryId) } } },
    });
    console.log(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Product exists" });
  }
});

/**
 * @route PUT /api/product/:id
 * @body {name:string}
 * @desc Updates a product.
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    console.log(req.body);
    res.status(201).end();
  } catch (error) {
    console.error(error);
  }
});

/**
 * @route DDELETE /api/product/:id
 * @desc Deletes a product.
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).end();
  } catch (error) {
    console.error(error);
  }
});

export default router;
