import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:9000";

const Admin = () => {
  const [platzArray, setPlatzArray] = useState([]);
  const [platzFrei, setPlatzFrei] = useState("");
  const [umsatz, setUmsatz] = useState("");

  const fetchdat = () => {
    fetch(`${apiBase}/kino/platz/all`)
      .then((res) => res.json())
      .then((platzArry) => setPlatzArray(platzArry));
  };

  const counterPlatzFrei = () => {
    const frei = platzArray.filter((elt) => elt.status === "frei");
    setPlatzFrei(frei.length);
  };

  const counterUmsatz = () => {
    const besetzt = platzArray.filter((elt) => elt.status !== "frei");
    setUmsatz(besetzt.reduce((acc, elt) => acc + Number(elt.price), 0));
  };

  const resetSeats = () => {
    fetch(`${apiBase}/kino/platz/reset`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        fetchdat();
        counterPlatzFrei();
        counterUmsatz();
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetchdat();
  }, [platzArray.length]);

  useEffect(() => {
    counterPlatzFrei();
    counterUmsatz();
  }, [platzArray]);

  return (
    <>
      <h1>platzfrei : {platzFrei}</h1>
      <h1>umsatz : {umsatz}€</h1>
      <button onClick={resetSeats}>reset</button>
      <Link to="/">zurück zu home</Link>
      <div></div>
    </>
  );
};

export default Admin;
