import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const GradientLineChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Convert the date format from "dd/MM/yyyy" to "MM/dd/yyyy"
    const formatDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      return `${month}/${day}/${year}`;
    };

    const dates = Object.keys(data).sort((a, b) => new Date(formatDate(a)) - new Date(formatDate(b)));

    const balanceSeries = dates.map(date => {
      const incomeData = data[date].Income || [];
      const expenseData = data[date].Expense || [];
      const totalIncome = incomeData.reduce((sum, val) => sum + val, 0);
      const totalExpense = expenseData.reduce((sum, val) => sum + val, 0);
      return totalIncome - totalExpense;
    });

    const options = {
      series: [
        {
          name: "Balance",
          data: balanceSeries,
        },
      ],
      chart: {
        type: "line",        
        toolbar: {
          show: false, // Hides the toolbar (including download button)
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
      dataLabels: {
        enabled: false, // Disable showing values on the chart
      },
      stroke: {
         curve: 'straight'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      // fill: {
      //   type: "gradient",
      //   gradient: {
      //     shade: "dark",
      //     gradientToColors: ["#FDD835"],
      //     shadeIntensity: 1,
      //     type: "horizontal",
      //     opacityFrom: 1,
      //     opacityTo: 1,
      //     stops: [0, 100, 100, 100],
      //   },
      // },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data]);

  return <div id="chart" ref={chartRef}></div>;
};

export default GradientLineChart;