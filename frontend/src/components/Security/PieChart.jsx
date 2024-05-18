import React from 'react'
import { Pie } from "react-chartjs-2";

function PieChart({ pieMap }) {
    return (
        <div style={{ width: "50%" }}>
            <Pie
                data={{
                    labels: Object.keys(pieMap).map((item) => item),
                    datasets: [
                        {
                            label: "# of Vulnerabilities",
                            data: Object.values(pieMap).map((item) => item),
                            backgroundColor: [
                                "rgba(255, 99, 132, 0.2)",
                                "rgba(54, 162, 235, 0.2)",
                                "rgba(255, 206, 86, 0.2)",
                                "rgba(75, 192, 192, 0.2)",
                                "rgba(153, 102, 255, 0.2)",
                                "rgba(255, 159, 64, 0.2)",
                            ],
                            borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(54, 162, 235, 1)",
                                "rgba(255, 206, 86, 1)",
                                "rgba(75, 192, 192, 1)",
                                "rgba(153, 102, 255, 1)",
                                "rgba(255, 159, 64, 1)",
                            ],
                            borderWidth: 1,
                        },
                    ],
                }}
            />
        </div>
    )
}

export default PieChart