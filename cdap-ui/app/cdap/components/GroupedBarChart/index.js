/*
 * Copyright © 2017 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
*/

import PropTypes from 'prop-types';
import React from 'react';
import VegaLiteChart from 'components/VegaLiteChart';

const chartSpec = {
  "data": {
    "values": []
  },
  "mark": "bar",
  "autosize": {
    "type": "pad",
    "resize": true
  },
  "encoding": {
    "column": {
      "field": "name", "type": "ordinal"
    },
    "y": {
      "field": "count", "type": "quantitative",
      "axis": {"title": "Count", "grid": false}
    },
    "x": {
      "field": "type", "type": "nominal",
      "axis": {"title": ""}
    },
    "color": {
      "field": "type",
      "type": "nominal"
    }
  },
  "config": {
    "view": {"stroke": "transparent"}
  }
};

export default function GroupedBarChart({data, customEncoding = {}}) {
  let newSpec = {
    ...chartSpec,
    "encoding": {
      ...chartSpec.encoding,
      ...customEncoding
    }
  };
  return (
    <VegaLiteChart
      spec={newSpec}
      data={data}
    />
  );
}

GroupedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    count: PropTypes.number
  })).isRequired,
  customEncoding: PropTypes.object
};
