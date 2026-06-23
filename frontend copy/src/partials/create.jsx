import { useEffect, useReducer, useRef, useState } from "react";
import Navbar from "../partials/navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Create() {
  const initialState = {
    title: "",
    name: "",
    description: "",
    location: "",
    type: "Lost",
    image: null,
    loading: false,
  };

  function reducer(state, action) {
    return {
      ...state,
      [action.field]: action.payload,
    };
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Lost");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const refItem = useRef(null);

  useEffect(() => {
    refItem.current?.focus();
  }, []);

  const handle = async (e) => {
    e.preventDefault();
    dispatch({ field: "loading", payload: true });
    const formData = new FormData();

    formData.append("title", state.title);
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("location", state.location);
    formData.append("type", state.type);

    if (state.image) {
      formData.append("image", state.image);
    }

    const item = await fetch(`${import.meta.env.VITE_API_URL}/item/add`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await item.json();
    if (data.matchC > 0) {
      toast.success(
        `We found ${data.matchC} possible matches for your item! So see more details Go to My Items->Find matches`,
      );
    } else {
      toast.info("No matching items found yet.");
    }
    setTimeout(() => {
      dispatch({ field: "loading", payload: false });
      navigate("/");
    }, 2000);
  };
  return (
    <>
      <Navbar />
      <div className="createContainer">
        <div className="postItem">
          <form onSubmit={handle} style={{ marginLeft: "8px" }}>
            <br />
            Item Title{" "}
            <input
              type="text"
              ref={refItem}
              className="ip"
              required
              name="title"
              value={state.title}
              placeholder="i.e. Phone, Calculator, Watch"
              onChange={(e) =>
                dispatch({
                  payload: e.target.value,
                  field: "title",
                })
              }
            />
            <br />
            <br />
            Item Name{" "}
            <input
              type="text"
              required
              className="ip"
              value={state.name}
              name="name"
              placeholder="ie (Iphone 17 pro/1+ buds 2 pro)"
              onChange={(e) =>
                dispatch({ field: "name", payload: e.target.value })
              }
            />
            <br />
            <br />
            Item Description(if required){" "}
            <input
              type="text"
              className="ip"
              name="desc"
              value={state.description}
              onChange={(e) =>
                dispatch({ field: "description", payload: e.target.value })
              }
            />
            <br />
            <br />
            Location{" "}
            <input
              type="text"
              className="ip"
              value={state.location}
              name="loc"
              onChange={(e) =>
                dispatch({ field: "location", payload: e.target.value })
              }
            />
            <br />
            <br />
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => {
                const file = e.target.files[0];

                if (!file) return;

                const allowedTypes = [
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                  "image/gif",
                  "image/bmp",
                  "image/svg+xml",
                  "image/avif",
                ];

                if (!allowedTypes.includes(file.type)) {
                  alert("Please select a valid image file.");
                  e.target.value = "";
                  dispatch({ field: "image", payload: null });
                  return;
                }

                dispatch({ field: "image", payload: file });
              }}
            />
            <br />
            <br />
            <button
              type="button"
              style={{
                backgroundColor: state.type === "Lost" ? "blue" : "lightgray",
                color: state.type === "Lost" ? "white" : "black",
                padding: "8px 17px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => dispatch({ field: "type", payload: "Lost" })}
            >
              Lost
            </button>
            <button
              type="button"
              style={{
                backgroundColor: state.type === "Found" ? "blue" : "lightgray",
                color: state.type === "Found" ? "white" : "black",
                padding: "8px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() =>
  dispatch({ field: "type", payload: "Found" })
}
            >
              Found
            </button>
            <br />
            <br />
            <button type="submit" className="btn" disabled={state.loading}>
              {state.loading ? "Uploading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {state.loading && <div className="AfterSubmit">Updating...</div>}
    </>
  );
}

export default Create;
