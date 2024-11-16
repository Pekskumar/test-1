import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const DoughnutChart = (props) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Extract category names and total values from props data
    const categories = Object.keys(props.data);
    const seriesData = categories.map((category) => props.data[category].total);

    const options = {
      series: seriesData,
      labels: categories,
      chart: {
        height: 400,
        type: "donut",
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "20px",
                fontFamily: "Verdana, sans-serif",
                fontWeight: 600,
                color: "#333",
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: "16px",
                fontWeight: 400,
                color: "#666",
                offsetY: 16,
                formatter: function (val) {
                  return val + "%";
                },
              },
              total: {
                show: true,
                showAlways: true,
                label: "Total",
                fontSize: "18px",
                fontWeight: 600,
                color: "#333",
                formatter: function (w) {
                  return (
                    w.globals.seriesTotals.reduce((a, b) => {
                      return a + b;
                    }, 0) + "%"
                  );
                },
              },
            },
          },
        },
      },
      fill: {
        type: "gradient",
       
      },
      stroke: {
        // show: true,
        // width: 3,
        // colors: ['#fff'],
      },
      tooltip: {
        enabled: true,
        // theme: 'dark',
        x: {
          show: true,
        },
        y: {
          formatter: function (val) {
            return val + "%";
          },
        },
      },
      legend: {
        formatter: function (val, opts) {
          return val + " - ₹" + opts.w.globals.series[opts.seriesIndex];
        },
        position: "left",
        horizontalAlign: "center",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [props.data]);

  return (
    <div id="chart" ref={chartRef} style={{ position: "relative" }}>
      {/* You can optionally add an image or other content here */}
      {/* <img src="https://via.placeholder.com/100" alt="Center Image" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '50%' }} /> */}
    </div>
  );
};

export default DoughnutChart;
