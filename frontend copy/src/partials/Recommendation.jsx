import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import { useUser } from "./UserContext";

function Recommendation() {
  const { itemId } = useParams();

  const [currentItem, setCurrentItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/item/recommend/${itemId}`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      setCurrentItem(data.currentItem);
      setRecommendations(data.recommendations);
    } catch (err) {
      console.log(err);
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
        itemId: id,
      }),
    });

    const data = await res.json();

    window.alert(data.msg);
  };

  return (
    <>
      <Navbar />

      {currentItem && (
        <div className="recommend-header">
          <h2>Recommendations For: {currentItem.itemName}</h2>

          <img
            src={currentItem.imageUrl}
            alt={currentItem.itemName}
            className="recommend-main-image"
            style={{
              maxWidth: "360px",
              width: "100%",
              height: "auto",
              borderRadius: "4px",
            }}
          />
        </div>
      )}

      <div className="recommend-grid">
        {recommendations.length === 0 ? (
          <h3>No Matches Found</h3>
        ) : (
          recommendations.map((item) => (
            <div className="recommend-card" key={item._id}>
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
                <p>Match Score : {item.score}</p>
                Matched Keywords :
                <div className="keyword-box">
                  {item.matchedKeywords.map((keyword, index) => (
                    <span key={index} className="keyword">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Recommendation;
