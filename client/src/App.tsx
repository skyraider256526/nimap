import Category from "components/category.components";
import Products from "components/products.component";
import { useState } from "react";
import "./App.css";

function App() {
  const [category, setCategory] = useState({ name: "all", id: -1 });
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-3 h-100">
          <Category category={category} setCategory={setCategory} />
        </div>
        <div className="col-9">
          <Products category={category} />
        </div>
      </div>
    </div>
  );
}

export default App;
