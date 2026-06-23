import { useState, useEffect } from "react";
import Navbar from "./navbar";
import { useUser } from "./UserContext";

function Lost() {
  const [items, setItems] = useState([]);
  const { user, setUser } = useUser();
  const [search, setSearch] = useState("");
  const [itemGTO, setItemGTO] = useState(true);
  async function fetchData() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/item/lost`);
      const data = await res.json();
      setItems(data.allLost);
      setItemGTO(data.allLost.length > 0);
    } catch (err) {
      console.log(err);
    }
  }

  async function searchItem()
  {
    try{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/item/search`, {
      credentials : "include",
      method : "POST",
      headers : {
        "Content-type" : "application/json"
      },
      body : JSON.stringify({
        searchContent : search,
        type : "Lost"
      })
    })
    if(res.status == 500)
    {
      console.log("Internal server error")
      return
    }
    const resp = await res.json();
    setItems(resp.allItem);
  }
    catch(err)
    {
      console.log("Error : " , err);
    }
  }

  
  const handleClaim = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to claim this item?",
    );

    if (!confirmed) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/item/claim`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        claimedby: user._id,
        itemId: id,
      }),
    });
    window.alert((await res.json()).msg);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchItem();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <Navbar />
      {user && <div className="searchBar">
        🔍{" "}
        <input
          type="text"
          placeholder=" search..."
          className="searchbtn"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>}
      <span style={{ fontWeight: "600", fontSize: "21px", margin: "24px" }}>
        Lost Items
      </span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          padding: "10px",
        }}
      >
        {!itemGTO && <p>No items found</p>}
        {items.map((item) => (
          <div className="div" key={item._id}>
            <h3 style={{ margin: "5px" }}>Title : {item.itemTitle}</h3>
            <h4 style={{ margin: "5px" }}>Name : {item.itemName}</h4>
            <p style={{ margin: "5px" }}>Description : {item.itemDesc}</p>
            <p style={{ margin: "5px" }}>Location : {item.location}</p>
            <div>
              {user && user._id != item.createdBy._id && (
                <button
                  type="button"
                  onClick={() => handleClaim(item._id)}
                  className="btn"
                  style={{ marginBottom: "10px" }}
                >
                  <b>Claim</b>
                </button>
              )}

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
            <br />
            {user && (
              <p style={{ fontSize: "12px" }}>
                Created By: {item.createdBy.userName}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Lost;
