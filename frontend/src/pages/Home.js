import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css";
const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:9000";
const Home = () => {
  const [platz, setPlatz] = useState([]);

  const fetchData = () => {
    fetch(`${apiBase}/kino/platz/all`)
      .then((res) => res.json())
      .then((platz) => {
        setPlatz(platz);
      });
  };

  const updateSeatStatus = (id, newStatus) => {
    const data = {
      platzId: id,
      status: newStatus,
    };
    fetch(`${apiBase}/kino/platz/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("erfolgreich reserviert:", data);
        fetchData();
      })

      .catch((error) => console.error("Error:", error));
  };

  useEffect(fetchData, [platz.length]);

  return (
    <>
      <div className="salle">
        <div className="grid">
          {platz.map((elt) =>
            elt.pltztype === "loge" ? (
              <div
                key={elt._id}
                className={
                  elt.status !== "frei" ? "loge-platz-reserviert" : "loge"
                }
                onClick={() =>
                  updateSeatStatus(
                    elt._id,
                    "reserviert"
                    // elt.status === "frei" ? "besetzt" : "frei"
                  )
                }
              ></div>
            ) : (
              <div
                key={elt._id}
                className={
                  elt.status !== "frei" ? "parket-platz-reserviert" : "parket"
                }
                onClick={() =>
                  updateSeatStatus(
                    elt._id,
                    "reserviert"
                    // elt.status === "frei" ? "besetzt" : "frei"
                  )
                }
              ></div>
            )
          )}
        </div>
        <div className="Leinwand"></div>
        <Link to="/admin">Dashbord</Link>
      </div>
    </>
  );
};

export default Home;
