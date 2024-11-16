import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const BarchartComponent = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Convert the date format from "dd/MM/yyyy" to "MM/dd/yyyy"
    const formatDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      return `${month}/${day}/${year}`;
    };

    const dates = Object.keys(data).sort((a, b) => new Date(formatDate(a)) - new Date(formatDate(b)));

    const incomeSeries = dates.map(date => {
      const incomeData = data[date].Income || [];
      return incomeData.reduce((sum, val) => sum + val, 0);
    });

    const expenseSeries = dates.map(date => {
      const expenseData = data[date].Expense || [];
      return expenseData.reduce((sum, val) => sum + val, 0);
    });

    const options = {
      series: [
        {
          name: "Expense",
          data: expenseSeries,
        },
        {
          name: "Income",
          data: incomeSeries,
        },
        
      ],
      chart: {
        type: "area",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        type: "datetime",
        categories: dates.map(formatDate),
        tickAmount: 10,
        labels: {
          formatter: function (value, timestamp, opts) {
            return opts.dateFormatter(new Date(timestamp), "dd/MM/yyyy");
          },
        },
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data]);

  return <div id="chart" ref={chartRef}></div>;
};

export default BarchartComponent;