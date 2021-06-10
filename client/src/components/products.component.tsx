import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BsPencilSquare, BsPlusCircle, BsTrash } from "react-icons/bs";
import useSWR from "swr";
import { fetcher } from "utils";
import CustomModal from "./models.component";
function Products({ category }: { category: { name: string; id: number } }) {
  const [pagination, setPagination] = useState({ limit: 10, page: 1 }),
    { data, error } = useSWR(
      `/api/product${category.name === "all" ? "" : "/" + category.id}/?l=${
        pagination.limit
      }&p=${pagination.page}`,
      fetcher
    ),
    [productId, setProductId] = useState(-1),
    [showUpdate, setShowUpdate] = useState(false),
    [showCreate, setShowCreate] = useState(false),
    [showDelete, setShowDelete] = useState(false),
    limitInputRef = useRef<HTMLInputElement>(null),
    createInputRef = useRef<HTMLInputElement>(null),
    updateInputRef = useRef<HTMLInputElement>(null);

  async function createProduct(data: { name: string; categoryId: number }) {
    console.log(data);
    if (!data.name || !data.categoryId) return;
    const res = await fetch(
      `${process.env.API_URL || "http://localhost:8080/api"}/product`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setShowCreate(false);
    console.log(await res.json());
  }

  async function updateProduct(data: { name: string }) {
    console.log(data);
    if (!data.name) return;
    await fetch(
      `${
        process.env.API_URL || "http://localhost:8080/api"
      }/product/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setShowUpdate(false);
    console.log("Product updated");
  }
  async function deleteProduct() {
    await fetch(
      `${
        process.env.API_URL || "http://localhost:8080/api"
      }/product/${productId}`,
      {
        method: "DELETE",
      }
    );
    setShowDelete(false);
    console.log("Product Deleted");
  }

  function paginationButton(limit, count) {
    let i = limit;
    let pageButton: any[] = [];
    for (let j = 1; j <= Math.ceil(count / limit); j++) {
      pageButton.push(
        <Button
          size="sm"
          className="mx-2"
          onClick={() => setPagination({ limit: pagination.limit, page: j })}
        >
          {j}
        </Button>
      );
    }
    return pageButton;
  }

  if (error) {
    console.error(error);
    return <h1>something went wrong</h1>;
  } else if (!data) return <h1>Loading...</h1>;
  console.log(data);
  return (
    <div className="d-flex flex-column">
      <ul className="list-group">
        {data.products.map(item => (
          <li
            className={`list-group-item h5 d-flex justify-content-between`}
            key={item.id}
          >
            <span>{item.name}</span>
            <div>
              <span
                className="mr-1"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setProductId(item.id);
                  setShowUpdate(true);
                }}
              >
                <BsPencilSquare />
              </span>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setProductId(item.id);
                  setShowDelete(true);
                }}
              >
                <BsTrash />
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="d-flex">
        {category.name !== "all" && (
          <BsPlusCircle
            className="float-right h3"
            style={{ cursor: "pointer" }}
            onClick={() => setShowCreate(true)}
          />
        )}
        <input
          type="number"
          name="limit"
          id="limit"
          defaultValue={pagination.limit}
          ref={limitInputRef}
          style={{ width: 50 }}
        />
        <button
          onClick={() =>
            setPagination({
              limit: parseInt(limitInputRef.current!.value),
              page: pagination.page,
            })
          }
        >
          Submit
        </button>
        <div>{paginationButton(pagination.limit, data.count)}</div>
      </div>
      <CustomModal
        show={showUpdate}
        handleClose={setShowUpdate}
        title="Update Category"
      >
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              required
              ref={updateInputRef}
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={() =>
              updateProduct({ name: updateInputRef.current!.value })
            }
          >
            Submit
          </Button>
        </Form>
      </CustomModal>
      <CustomModal
        show={showCreate}
        handleClose={setShowCreate}
        title="Create Category"
      >
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              required
              ref={createInputRef}
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={() =>
              createProduct({
                name: createInputRef.current!.value,
                categoryId: category.id,
              })
            }
          >
            Submit
          </Button>
        </Form>
      </CustomModal>
      <CustomModal
        show={showDelete}
        handleClose={setShowDelete}
        title="Are you sure ?"
      >
        <Button variant="primary" onClick={() => deleteProduct()}>
          Delete
        </Button>
      </CustomModal>
    </div>
  );
}

export default Products;
