import React, { useState, useEffect } from "react";
import axios from "axios";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { format } from 'date-fns';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Example date format function
const formatDate = (dateString) => {
  return moment(dateString).format('YYYY-MM-DD HH:mm:ss');  // Adjust format as needed
};

const formatDateFromUnix = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);  // Convert from seconds to milliseconds
  //return date.toLocaleDateString();
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
};

const Weather = (weatherData) => {
   const [city, setCity] = useState("");
  const [rowData, setRowData] = useState([]);
   const [minTemprature, setMinTemprature] = useState(20.00);
   const [maxTemprature, setMaxTemprature] = useState(30.00);
   const [fromDate, setFromDate] = useState(new Date("2024-09-01 00:00:00"));
   const [toDate, setToDate] = useState(new Date("2024-09-04 00:00:00"));

  // Column Definitions: Defines the columns to be displayed.
    // Define common column types
    const columnTypes = {
      numberColumn: { filter: 'agNumberColumnFilter' },
      textColumn: { filter: 'agTextColumnFilter' },
      dateColumn: { filter: 'agDateColumnFilter',             
      filterParams: {
          // Provide a date comparator for correct date filtering
          comparator: (filterLocalDateAtMidnight, cellValue) => {
              const cellDate = new Date(cellValue);
              if (cellDate < filterLocalDateAtMidnight) return -1;
              if (cellDate > filterLocalDateAtMidnight) return 1;
              return 0;
          }
        }
    },
  };

  const dateComparator = (filterLocalDateAtMidnight, cellValue) => {
    if (!cellValue) return -1;  // Handle null values
    const cellDate = new Date(cellValue);
    const filterDate = new Date(filterLocalDateAtMidnight);
    
    if (cellDate < filterDate) return -1;
    if (cellDate > filterDate) return 1;
    return 0;
};

  // Column definitions with type declarations
  const columns = [
      // { headerName: 'ID', field: 'id', type: 'numberColumn', filter: 'agNumberColumnFilter' },
      { headerName: 'City', field: 'city', type: 'textColumn', filter: 'agTextColumnFilter'},
      { headerName: 'Temperature', field: 'avgTemp', type: 'numberColumn', filter: 'agNumberColumnFilter' },
      { headerName: 'Humidity', field: 'avgHumidity', type: 'numberColumn', filter: 'agNumberColumnFilter' },
      { headerName: 'Pressure', field: 'avgPressure', type: 'numberColumn', filter: 'agNumberColumnFilter' },
      // { headerName: 'Weather', field: 'weather', type: 'textColumn', filter: 'agTextColumnFilter' },
      { headerName: 'minDate', field: 'minDate', type: 'dateColumn', 
      valueFormatter: (params) => formatDateFromUnix(params.value), 
      filter: 'agDateColumnFilter',
      //filterParams: { comparator: dateComparator } 
      },
      { headerName: 'maxDate', field: 'maxDate', type: 'dateColumn', 
      valueFormatter: (params) => formatDateFromUnix(params.value), 
      filter: 'agDateColumnFilter',
      //filterParams: { comparator: dateComparator } 
    },
  ];
 
  useEffect(() => {
    // Fetch data when the component mounts
    fetchWeatherData();
  }, [toDate, fromDate]); 

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
//       `http://localhost:4000/weather`
//        `http://localhost:4000/weather/query?minValue=${minTemprature}&maxValue=${maxTemprature}`
//        `http://localhost:4000/weather/query?startDate=${fromDate}&endDate=${toDate}&minValue=${minTemprature}&maxValue=${maxTemprature}`
      //  `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${process.env.REACT_APP_API_KEY}`
      //`http://localhost:4000/weather/aggregation`
      `http://localhost:4000/weather/aggregation?startDate=${fromDate}&endDate=${toDate}`
    );
      console.log("response data: " + JSON.stringify(response.data.data));
      setRowData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //fetchWeatherData();
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <div>

      {/* <div>
      <input
                type="text"
                value={city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
              <br/>
      </div> */}
      <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
      <DatePicker
        selected={fromDate}
        onChange={(date) => setFromDate(new Date(date))} // Update the selected date
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm:ss" // Customize the date format
        placeholderText="Select a date and time"
        isClearable // Allow clearing the selected date
        showYearDropdown // Enable year dropdown
        scrollableYearDropdown // Make year dropdown scrollable
      />
      {fromDate && <p>Selected From Date: {formatDate(fromDate.toLocaleDateString())}</p>}
      <DatePicker
        selected={toDate}
        onChange={(date) => setToDate(new Date(date))} // Update the selected date
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm:ss" // Customize the date format
        placeholderText="Select a date and time"
        isClearable // Allow clearing the selected date
        showYearDropdown // Enable year dropdown
        scrollableYearDropdown // Make year dropdown scrollable
      />
      {toDate && <p>Selected To Date: {formatDate(toDate.toLocaleDateString())}</p>}
      {rowData && (
        <AgGridReact
        rowData={rowData}
        columnDefs={columns}
        //columnTypes={columnTypes}  // Apply predefined column types
        defaultColDef={{ flex: 1, }}
/>
      )}
      {/* {weatherData && (
    <div>
          <h2>{weatherData[0].city}</h2>
          <p>Temperature: {weatherData[0].temperature}°C</p>
          <p>Description: {weatherData[0].weather}</p>
          <p>Humidity : {weatherData[0].humidity}%</p>
          <p>Pressure : {weatherData[0].pressure}</p>
     </div>
      )} */}
    </div>
    </div>
  );
};

export default Weather;
