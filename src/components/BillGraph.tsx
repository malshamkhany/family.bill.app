import moment from "moment";
import CanvasJSReact from "@canvasjs/react-charts";
import { useEffect, useRef, useState } from "react";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface Data {
  label: string;
  y: number;
  x: number;
  settled: boolean;
  color: string;
}
const zoomBtns = [
  { key: "6months", label: "6 Months", value: 6 },
  { key: "1year", label: "1 Year", value: 12 },
  //   { key: "2year", label: "2 Years", value: 24 },
  { key: "alltime", label: "All Time", value: 0 },
];

const BillGraph = ({ data }: { data: Data[] }) => {
  const chartRef = useRef(null); // Step 1: Create a ref for the chart
  const [zoomView, setZoomView] = useState(zoomBtns[0]);
  const maxYvalue = getMaxYValue(data);
  const avgYvalue = getAvgYValue(data.filter(f => f.settled).slice(-4)); // Calculate the average value

  const options = {
    // colorSet: "customColorSet1",
    animationEnabled: true,
    height: window.screen.height * 0.5,
    toolbar: {
      buttonBorderColor: "black",
      itemBackgroundColor: "white",
      itemBackgroundColorOnHover: "#0784b5",
      fontColor: "black",
    },
    // exportFileName: `bills_export_${moment().format("DD_MM_YYYY")}`, //Give any name accordingly
    // exportEnabled: true,
    zoomEnabled: true,
    zoomType: "x",
    backgroundColor: "transparent",
    theme: "dark1", // "light1", "dark1", "dark2"
    axisY: {
      includeZero: true,
      labelPlacement: "outside", //Change it to "outside"
      tickPlacement: "inside",
      gridColor: "#444",
      labelFontFamily: "Lakes-Regular",
      labelFormatter: function (e) {
        return `${e.value / 1000}k`;
      },
      maximum: maxYvalue * 1.1, // add 10%
    },
    axisX: {
      viewportMinimum:
        zoomView.key === "alltime"
          ? monthOffsetTime(data[0].x, "minus")
          : data[data.length - Math.min(data.length, zoomView.value)].x,
      viewportMaximum: monthOffsetTime(data[data.length - 1].x, "plus"),
      labelMaxWidth: 70,
      labelWrap: true,
      labelAngle: 0,
      labelTextAlign: "center", // Change it to "left, "right
      labelFontFamily: "Lakes-Regular",
      //   labelFormatter: function (e) {
      // console.log(e)
      // return e.label;
      // return moment(new Date(e.value)).format("Do"); // for month MMM
      //   },
    },
    data: [
      {
        xValueType: "dateTime",
        indexLabel: zoomView.key === "6months" ? "{y}" : "",
        indexLabelFontFamily: "Lakes-Regular",
        indexLabelFontSize: 14,
        indexLabelPlacement: "outside",
        indexLabelOrientation: "horizontal",
        type: "column",
        // color: "#0784b5",
        dataPoints: data,
      },
      {
        type: "line",
        dataPoints: data.filter(d => d.settled).slice(-4).map(point => ({ x: point.x, y: avgYvalue })), // Create a horizontal line at the average value
        color: "#00FF00", // Red color for the average line
        lineDashType: "shortDash",
        showInLegend: true,
        legendText: "Past 4 Months Average",
      }
    ],
  };

  useEffect(() => {
    // Set initial state to pan mode after the component mounts
    const toggleZoomPan = () => {
      chartRef.current.toolbar.chart._zoomButton.click();
    };

    if (chartRef.current) {
      chartRef.current.toolbar.chart._zoomButton.click();
      chartRef.current.toolbar.chart._zoomButton.style.visibility = "hidden";
      let watermark = document.getElementsByClassName(
        "canvasjs-chart-credit"
      )[0] as HTMLElement;
      watermark.style.visibility = "hidden";
      (
        chartRef.current.toolbar.chart._resetButton as HTMLElement
      ).addEventListener("click", toggleZoomPan);
    }
    return () =>
      (
        chartRef.current?.toolbar.chart._resetButton as HTMLElement
      )?.removeEventListener("click", toggleZoomPan);
  }, []);

  const handleZoom = (zoom) => {
    setZoomView(zoom);
    if (chartRef.current) {
      chartRef.current.toolbar.chart._resetButton.click();
    }
  };

  return (
    <div className="h-full">
      <p className="mb-2">Zoom:</p>
      <div className="flex items-center justify-center gap-2 mb-8">
        {zoomBtns.map((z) => (
          <ZoomButton
            style={{
              backgroundColor: z.key === zoomView.key ? "#0784b5" : "#192428",
            }}
            onClick={() => handleZoom(z)}
            key={z.key}
          >
            {z.label}
          </ZoomButton>
        ))}
      </div>
      <CanvasJSChart
        options={options}
        onRef={(ref) => (chartRef.current = ref)}
      />
    </div>
  );
};

function getMaxYValue(data: Data[]) {
  return data.reduce((max, item) => (item.y > max ? item.y : max), -Infinity);
}

function getAvgYValue(data: Data[]) {
  const sum = data.reduce((total, item) => total + item.y, 0);
  return Math.round(sum / data.length);
}


function monthOffsetTime(date: number, mode: "minus" | "plus") {
  const dateToOffset = moment(new Date(date));

  if (mode === "minus") dateToOffset.subtract(1, "month");
  if (mode === "plus") dateToOffset.add(1, "month");

  return dateToOffset.toDate().getTime();
}

const ZoomButton = ({ children, className = "", ...rest }) => {
  return (
    <button
      {...rest}
      className={`p-2 bg-[#192428] font-[Lakes-Bold] w-full whitespace-nowrap text-sm ${className}`}
    >
      {children}
    </button>
  );
};

export default BillGraph;
