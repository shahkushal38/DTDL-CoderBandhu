import React, { useEffect, useState } from "react";
import axios from "axios";

const FetchData = ({ steps, previousStep, triggerNextStep }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInput = previousStep.message;

  //   const apiEndpoint = `https://api.restful-api.dev/objects`;

  useEffect(() => {
    // Define your API endpoint and parameters here
    const apiEndpoint = `https://api.restful-api.dev/objects`;

    axios
      .get(apiEndpoint)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userInput]);

  useEffect(() => {
    if (!loading && !error) {
      triggerNextStep();
    }
  }, [loading, error, triggerNextStep]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Customize how you want to display the fetched data */}
      <div>Data: {JSON.stringify(data)}</div>
      {/* <button onClick={() => triggerNextStep()}>Next</button> */}
    </div>
  );
};

export default FetchData;
