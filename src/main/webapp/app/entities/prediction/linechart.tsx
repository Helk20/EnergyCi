import React, { useEffect, useRef } from 'react';
import Chart, { ChartOptions } from 'chart.js/auto';
import 'chartjs-adapter-moment';



interface LineChartProps {
  predictionList: {
    dateDebut: string;
    consommationPredit: number;
  }[];
}

const LineChart: React.FC<LineChartProps> = ({ predictionList }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        const data = {
          labels: predictionList.map((prediction) => new Date(prediction.dateDebut).toLocaleDateString()),
          datasets: [
            {
              label: 'Temperature',
              data: predictionList.map((prediction) => prediction.consommationPredit),
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: true,
            },
          ],
        };

        const options: ChartOptions = {
            scales: {
              x: {
                
                display: true,
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                type: 'linear',
                title: {
                  display: true,
                  text: 'Temperature°C',
                },
              },
            },
          };
          
          
          
          
          
          
          
          
          
          
          
          

        // Check if chart instance exists and destroy it before creating a new one
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: data,
          options: options,
        });
      }
    }

    // Cleanup function to destroy the chart when the component is unmounted
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [predictionList]);

  return (
    <div>
      <canvas id="myLineChart" ref={chartRef} width="900" height="200"></canvas>
    </div>
  );
};

export default LineChart;
