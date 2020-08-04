// A component to display the list of cryptocurrency that can apply specified filtering and sorting

import React, { useState } from 'react';
import CoinDetail from './CoinDetail.js';

const CoinList = (props) => {

  console.log(props.data);  // debugger

  const [sortType] = useState(props.sortType);
  let filterData = props.data;

  // Function for sorting data by providing sorting reference or method (eg. b=base, q=quote)
  const sortData = (a, b) => {
    if(a[sortType] < b[sortType]){
      return -1;
    } else if (a[sortType] > b[sortType]) {
      return 1;
    } else {
      return 0;
    }
  }

  // Confirm the data is loaded, otherwise return null
  if(props.data === "" || props.data ==="undefined") {
    return null;
  } else {
    // Filter for categories that selected the current cryptocurrency
    if(props.currentSelection!=="") {
      filterData = props.data.filter(element=>element.q===props.currentSelection);
    }
    const sortedData = filterData.sort(sortData);
    return sortedData.map((element) => {
      return (
        <CoinDetail key={element.s} element={element} />
      )
    });
  }
}

export default CoinList;
