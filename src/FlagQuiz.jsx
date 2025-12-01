import { useState, useEffect } from "react";
import "./App.css";
import "./bootstrap.min.css";
import countries from "world-countries";

const FlagQuiz = () => {
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [disabledButtons, setDisabledButtons] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(20);

  const getRandomCountry = () =>
    countries[Math.floor(Math.random() * countries.length)];

  const generateOptions = (currentCountry) => {
    const shuffled = [...countries].sort(() => 0.5 - Math.random()).slice(0, 4);

    if (!shuffled.find((c) => c.cca2 === currentCountry.cca2)) {
      shuffled[Math.floor(Math.random() * 4)] = currentCountry;
    }

    return shuffled.sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    nextFlag();
  }, []);

  // Contador
  useEffect(() => {
    if (secondsLeft <= 0) {
      setMessage("⏰ Se acabó el tiempo!");
      setScore((prev) => prev - 10);
      setDisabledButtons(
        options.reduce((acc, c) => {
          acc[c.cca2] = true;
          return acc;
        }, {})
      );
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, options]);

  const getFlagUrl = (code) =>
    `https://flagcdn.com/256x192/${code.toLowerCase()}.png`;

  const handleClick = (country) => {
    if (country.cca2 === current.cca2) {
      setMessage("✅ Correcto!");
      setScore(score + secondsLeft); // puntaje = segundos restantes
      setDisabledButtons(
        options.reduce((acc, c) => {
          acc[c.cca2] = true;
          return acc;
        }, {})
      );
    } else {
      setMessage("❌ Incorrecto!");
      setScore(score - 10);
      setDisabledButtons((prev) => ({ ...prev, [country.cca2]: true }));
    }
  };

  const nextFlag = () => {
    const country = getRandomCountry();
    setCurrent(country);
    setOptions(generateOptions(country));
    setMessage("");
    setDisabledButtons({});
    setSecondsLeft(20); // reset contador
  };

  if (!current) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "700px", borderRadius: "15px" }}
      >
        <h1 className="text-center mb-4">🌎 Flag Quiz</h1>

        <div className="text-center mb-4">
          <img
            src={getFlagUrl(current.cca2)}
            alt={current.name.common}
            className="img-fluid rounded shadow-sm"
            style={{
              maxHeight: "200px",
              objectFit: "cover",
              transition: "transform 0.3s",
            }}
          />
        </div>

        <p className="text-center fw-bold">Tiempo restante: {secondsLeft}s</p>

        <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
          {options.map((country) => (
            <button
              key={country.cca2}
              className="btn btn-outline-primary px-3 py-2 m-1"
              onClick={() => handleClick(country)}
              disabled={disabledButtons[country.cca2]}
            >
              {country.name.common}
            </button>
          ))}
        </div>

        {message && (
          <p
            className={`text-center fw-bold ${
              message.includes("✅") ? "text-success" : "text-danger"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center fw-bold">Puntuación: {score}</p>

        <div className="text-center">
          <button className="btn btn-success mt-3 px-4" onClick={nextFlag}>
            Siguiente bandera
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlagQuiz;
