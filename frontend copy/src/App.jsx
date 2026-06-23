import { useEffect, useState } from "react";
import Navbar from "./partials/navbar";
import { useUser } from "./partials/UserContext";

function App() {
  const { user, setUser } = useUser();
  const [Item, setItem] = useState([]);
  const [itemGTO, setItemGTO] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user/current-user`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => console.log(err));
  }, []);

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
        searchContent : search
      })
    })
    if(res.status == 500)
    {
      console.log("Internal server error")
      return
    }
    const resp = await res.json();
    setItem(resp.allItem);
  }
    catch(err)
    {
      console.log("Error : " , err);
    }
  }

  async function GetItems() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/item`, {
      credentials: "include",
    });
    const resp = await res.json();
    setItem(resp.allItem);
    setItemGTO(resp.allItem.length > 0);
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
    GetItems();
  }, []);

  useEffect(()=>{
    searchItem();
  }, [search])

  return (
    <>
      <Navbar />
      <div className="searchBar">
        🔍 <input type="text" placeholder=" search..." className="searchbtn"
        onChange={(e)=>{setSearch(e.target.value)}}/>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          padding: "10px",
        }}
      >
        {!itemGTO && <p>No items found</p>}
        {Item.map((item) => (
          <div className="div" key={item._id}>
            <div
              className="itemType"
              style={{ fontSize: "17px", fontWeight: "600" }}
            >
              {item.TypeOfItem}
            </div>
            <h3 style={{ margin: "5px" }}>Title : {item.itemTitle}</h3>
            <h3 style={{ margin: "5px" }}>Name : {item.itemName}</h3>
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
            {user && (
              <p style={{ fontSize: "13px", marginBottom: "0px" }}>
                Created By: {item.createdBy.userName}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
