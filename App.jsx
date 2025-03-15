import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:7777/api/items";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [price, setPrice] = useState(""); 

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      console.error("❌ Error fetching items:", error);
    }
  };

  const addItem = async () => {
    if (!newItem.trim() || !price.trim()) {
      alert("Item name and price are required!");
      return;
    }

    try {
      const response = await axios.post(API_URL, { 
        name: newItem, 
        price: parseFloat(price) 
      }, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 201) {
        setItems([...items, response.data]);
        setNewItem("");
        setPrice(""); 
      } else {
        alert("Failed to add item!");
      }
    } catch (error) {
      console.error(" Error adding item:", error.response ? error.response.data : error);
      alert("Error adding item to database");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error(" Error deleting item:", error);
    }
  };

  return (
    <div className="container">
      <h1>Product Manager</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter item name"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter item price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={addItem}>Add Item</button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price}
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
