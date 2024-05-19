import React, { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";

const FetchData = ({ steps, previousStep, triggerNextStep }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInput = previousStep.message;

  //   const apiEndpoint = `https://api.restful-api.dev/objects`;

  useEffect(() => {
    // Define your API endpoint and parameters here
    const apiEndpoint = `http://127.0.0.1:5000/api/send_message`;
    (async () => {
      await axiosClient
        .post(apiEndpoint, {
          meeting_id: localStorage.getItem("meetId"),
          question: userInput,
        })
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
          triggerNextStep();
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    })();
  }, [userInput, triggerNextStep]);

  // useEffect(() => {
  //   if (!loading && !error) {
  //     setTimeout(() => {
  //       triggerNextStep();
  //     }, 5000);
  //   }
  // }, [loading, error, triggerNextStep]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Customize how you want to display the fetched data */}
      {data && <div> {data}</div>}
      {/* <button onClick={() => triggerNextStep()}>Next</button> */}
    </div>
  );
};

export default FetchData;
