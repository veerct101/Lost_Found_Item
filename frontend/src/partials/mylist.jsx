import { useState, useEffect } from "react";
import Navbar from "./navbar";
import { useUser } from "./UserContext";
import Recommendation from "./Recommendation";
import { Link } from "react-router-dom";

function Found() {
  const [items, setItems] = useState([]);
  const { user, setUser } = useUser();
  const [itemGTO, setItemGTO] = useState(true);
  const [search, setSearch] = useState("");

  
  async function fetchData() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/item/user`, {
        credentials: "include",
      });
      const data = await res.json();
      setItems(data.allItem);
      setItemGTO(data.allItem.length > 0);
    } catch (err) {
      console.log(err);
    }
  }

  async function searchItem() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/item/search`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          searchContent: search,
          type: "User",
        }),
      });
      if (res.status == 500) {
        console.log("Internal server error");
        return;
      }
      const resp = await res.json();
      setItems(resp.allItem);
    } catch (err) {
      console.log("Error : ", err);
    }
  }

  useEffect(() => {
    const fetch = async () => {
      await fetchData();
    };
    fetch();
  }, []);

  useEffect(() => {
    if(search == "")
    {
      return
    }
    const timer = setTimeout(() => {
      searchItem();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleRemove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to Remove this item?",
    );

    if (!confirmed) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/item/remove`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: id,
      }),
    });
    const data = await res.json();
    setItems(data.allItem);
    setItemGTO(data.allItem.length > 0);
    fetchData();
  };

  return (
    <>
      <Navbar />
      {user && <div className="searchBar">
        🔍{" "}
        <input
          type="text"
          value={search}
          placeholder="search..."
          className="searchbtn"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>}
      <span style={{ fontWeight: "600", fontSize: "21px", margin: "24px" }}>
        Items
      </span>
      {!itemGTO && <p>No items found</p>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          padding: "10px",
        }}
      >
        {items.map((item) => (
          <div className="div" key={item._id}>
            <h3 style={{ margin: "5px" }}>Title : {item.itemTitle}</h3>
            <h4 style={{ margin: "5px" }}>Name : {item.itemName}</h4>
            <p style={{ margin: "5px" }}>Description : {item.itemDesc}</p>
            <p style={{ margin: "5px" }}>Location : {item.location}</p>

            {user && user._id == item.createdBy._id && (
              <button
                type="button"
                onClick={() => handleRemove(item.createdBy._id)}
                className="btn"
              >
                <b>Remove</b>
              </button>
            )}
            {user && (
              <Link to={`/recommend/${item._id}`}>
                <button className="btn">Find Matches</button>
              </Link>
            )}
            <br />
            <img
              src={item.imageUrl}
              alt={item.itemTitle}
              style={{
                maxWidth: "300px",
                width: "100%",
                height: "auto",
                borderRadius: "4px",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default Found;
