import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BsPencilSquare, BsPlusCircle, BsTrash } from "react-icons/bs";
import useSWR from "swr";
import { fetcher } from "utils";
import CustomModal from "./models.component";
function Category({
  category,
  setCategory,
}: {
  category: { name: string; id: number };
  setCategory: React.Dispatch<
    React.SetStateAction<{ name: string; id: number }>
  >;
}) {
  const { data, error } = useSWR("/api/category", fetcher),
    [showUpdate, setShowUpdate] = useState(false),
    [showCreate, setShowCreate] = useState(false),
    [showDelete, setShowDelete] = useState(false),
    createInputRef = useRef<HTMLInputElement>(null),
    updateInputRef = useRef<HTMLInputElement>(null);

  async function createCategory(data: { name: string }) {
    console.log(data);
    if (!data.name) return;
    const res = await fetch(
      `${process.env.API_URL || "http://localhost:8080/api"}/category`,
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

  async function updateCategory(data: { name: string }) {
    console.log(data);
    if (!data.name) return;
    await fetch(
      `${process.env.API_URL || "http://localhost:8080/api"}/category/${
        category.id
      }`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setShowUpdate(false);
    console.log("Category updated");
  }
  async function deleteCategory(id: number) {
    await fetch(
      `${process.env.API_URL || "http://localhost:8080/api"}/category/${
        category.id
      }`,
      {
        method: "DELETE",
      }
    );
    setShowDelete(false);
    console.log("Category Deleted");
  }
  if (error) {
    console.error(error);
    return <h1>something went wrong</h1>;
  } else if (!data) return <h1>Loading...</h1>;

  return (
    <div className="d-flex flex-column">
      <ul className="list-group">
        <li
          className={`list-group-item h5 ${
            category.name === "all" ? "active" : ""
          }`}
          onClick={() => setCategory({ name: "all", id: -1 })}
          style={{ cursor: "pointer" }}
        >
          All
        </li>
        {data.result.map(item => (
          <li
            className={`list-group-item h5 d-flex justify-content-between ${
              item.name === category.name ? "active" : ""
            }`}
            onClick={() => {
              setCategory({ name: item.name, id: item.id });
            }}
            key={item.id}
          >
            <span style={{ cursor: "pointer" }}>{item.name}</span>
            <div>
              <span
                className="mr-1"
                style={{ cursor: "pointer" }}
                onClick={() => setShowUpdate(true)}
              >
                <BsPencilSquare />
              </span>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setShowDelete(true)}
              >
                <BsTrash />
              </span>
            </div>
          </li>
        ))}
      </ul>
      <BsPlusCircle
        className="float-right h3"
        style={{ cursor: "pointer" }}
        onClick={() => setShowCreate(true)}
      />
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
              updateCategory({ name: updateInputRef.current!.value })
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
              createCategory({ name: createInputRef.current!.value })
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
        <Button variant="primary" onClick={() => deleteCategory(category.id)}>
          Delete
        </Button>
      </CustomModal>
    </div>
  );
}

export default Category;
