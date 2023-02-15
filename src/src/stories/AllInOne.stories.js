import AllInOne from '../components/examples/AllInOne.vue';

export default {
  title: 'Example/AllInOne',
  component: AllInOne,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AllInOne },
  template:
    `<div>
      <d-export-data
        :chartId="'xychart'"
        :locale="'fr-FR'"
        :timeOffset="'UTC+01:00:00'"
        :chartData="chartData"
        :style="{ display: 'flex' }"
      >
        <template v-slot="{ getCsv, canPng, getPng }">
          <div :style="{ cursor: 'pointer', border: '2px solid red', margin: '2px', padding: '2px' }" @click="getCsv"> CSV </div>
          <div v-if="canPng" :style="{ cursor: 'pointer', border: '2px solid red', margin: '2px', padding: '2px' }" @click="getPng"> PNG </div>
        </template>
      </d-export-data>
      <all-in-one
        :data="data"
        :yAxisRanges="yAxisRanges"
        :heatRanges="heatRanges"
      />
    </div>`,
});

const makeLineSerie = (name, tZero, vZero, elapsedTime, rangeValue, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    data.push({
      timestampX: tZero,
      valueY: vZero
    });

    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;

    tZero += elapsedTime;
    vZero += (Math.random() * rangeValue * plusOrMinus);
  }

  return {
    serie: name,
    data: data
  };
}

const makeScoreCardOperand = (label, tZero, elapsedTime) => {
  return {
    label: label,
    data: [{
      timestampX: tZero,
      closeTimestampX: tZero + elapsedTime,
      valueY: Math.ceil(Math.random() * 1000)
    }]
  };
}

const makeHeatmapDCOperand = (label, tZero, elapsedTime, categoriesY, rangeValue, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    for (let j = 0; j < categoriesY.length; j++) {
      data.push({
        timestampX: tZero,
        closeTimestampX: tZero + elapsedTime,
        categoryY: categoriesY[j],
        categoryCodeY: label + "-" + categoriesY[j],
        valueZ: Math.floor(Math.random() * rangeValue)
      });
    }
    tZero += elapsedTime;
  }

  return {
    label: label,
    data: data
  };
}

const makeHeatmapCCOperand = (label, categoriesX, categoriesY, range) => {
  var data = [];
  for (let i = 0; i < categoriesX.length; i++) {
    for (let j = 0; j < categoriesY.length; j++) {
        data.push({
          categoryX: categoriesX[i],
          categoryCodeX: categoriesX[i],
          categoryY: categoriesY[j],
          categoryCodeY: categoriesY[j],
          valueZ: Math.floor(Math.random() * range)
        });
    }
  }

  return {
    label: label,
    data: data
  };
}

const makePieOperand = (label, categories) => {
  var data = [];
  for (let i = 0; i < categories.length; i++) {
    let subs = makePieSubs(categories[i], ["A", "B"], 5);
    data.push({
      categoryX: categories[i],
      valueY: subs.reduce((acc, cur) => acc + cur.valueY, 0),
      subs: subs
    });
  }

  return {
    label: label,
    data: data
  };
}

const makePieSubs = (main, categories, rangeValue) => {
  return categories.map(c => {
    let subs = makePieSubSubs(main + " : " + c, ["1", "2"], rangeValue);
    return {
      categoryX: main + " : " + c,
      valueY: subs.reduce((acc, cur) => acc + cur.valueY, 0),
      subs: subs
    }
  });
}

const makePieSubSubs = (main, categories, rangeValues) => {
  return categories.map(c => {
    return {
      categoryX: main + " : " + c,
      valueY: Math.floor(Math.random() * rangeValues + 1),
      subs: []
    }
  });
}

const makeLineOperand = (label, tZero, vZero, elapsedTime, rangeValue, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    data.push({
      timestampX: tZero,
      valueY: vZero
    });

    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;

    tZero += elapsedTime;
    vZero += (Math.random() * rangeValue * plusOrMinus);
  }

  return {
    label: label,
    data: data
  };
}

const makeHistogramOperand = (label, tZero, vZero, elapsedTime, rangeValue, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    data.push({
      timestampX: tZero,
      closeTimestampX: tZero + elapsedTime,
      valueY: vZero
    });

    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;

    tZero += elapsedTime;
    vZero += (Math.floor(Math.random() * rangeValue) * plusOrMinus)
  }

  return {
    label: label,
    data: data
  };
}

const makePlanningOperand = (label, tZero, categories, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    let categoryRandom = Math.floor(Math.random() * categories.length);
    data.push({
      timestampX: tZero,
      closeTimestampX: tZero + 2.16e+7,
      categoryY: categories[categoryRandom],
      categoryCodeY: label + "-" + categories[categoryRandom]
    });
    tZero += 2.16e+7
  }

  return {
    label: label,
    data: data
  };
}

const makeTopOperand = (label, categories, rangeValue) => {
  var data = [];
  for (let i = 0; i < categories.length; i++) {
    let value = Math.floor(Math.random() * rangeValue) + 1;
    data.push({
      categoryY: categories[i],
      categoryCodeY: categories[i],
      valueX: 0,
      closeValueX: value,
      selfValueX: value
    });
  }

  return {
    label: label,
    data: data
  };
}

const makeBarsOperand = (label, categories, rangeValue) => {
  var data = [];
  for (let i = 0; i < categories.length; i++) {
    data.push({
      categoryX: categories[i],
      categoryCodeX: categories[i],
      valueY: Math.floor(Math.random() * rangeValue)
    });
  }

  return {
    label: label,
    data: data
  };
}

export const Default = Template.bind({});
Default.args = {
  data: {
    series: [
      { ...makeLineSerie("Line 1", 1660860000000 + 86400000, 0, 2.16e+7, 2, 50) },
      { ...makeLineSerie("Line 2", 1660860000000 + 86400000, 0, 2.16e+7, 2, 50) },
      { ...makeLineSerie("Line 3", 1660860000000 + 86400000, 0, 2.16e+7, 2, 50) }
    ]
  },
  chartData: {
    chartType: 3,
    xAxisType: 3,
    plots: [{
      yAxisType: 3,
      series: [{
        serieType: 12,
        operands: [
          // { ...makeScoreCardOperand("Gauffre", 1660860000000, 86400000) },
          { ...makeHeatmapCCOperand("Line 1", ["A", "B", "C"], ["1", "2", "3"], 50) },
          { ...makeHeatmapCCOperand("Line 2", ["A", "B", "C"], ["1", "2", "3"], 10) }
        ]
      }]
    }]
  },
  // chartData: {
  //   chartType: 3,
  //   xAxisType: 1,
  //   plots: [{
  //     yAxisType: 3,
  //     series: [{
  //       serieType: 12,
  //       operands: [{
  //         ...makeHeatmapDCOperand("Occupancy", 1661817600000, 3600000, ["Dawn", "Morning", "Afternoon", "Evening", "Night"], 600, 24)
  //       }, {
  //         ...makeHeatmapDCOperand("Blob", 1661817600000, 3600000, ["Blob"], 600, 24)
  //       }]
  //     }]
  //   }]
  // },
  // chartData: {
  //   chartType: 2,
  //   xAxisType: 0,
  //   plots: [{
  //     yAxisType: 0,
  //     series: [{
  //       serieType: 11,
  //       operands: [{
  //         ...makePieOperand("Categories", ["Pineapple"], 5)
  //       }]
  //     }]
  //   }]
  // },
  // chartData: {
  //   chartType: 1,
  //   xAxisType: 1,
  //   plots: [{
  //     yAxisType: 2,
  //     series: [{
  //       serieType: 1,
  //       operands: [{
  //         ...makeLineOperand("Line 1", 1660860000000 + 86400000, 0, 2.16e+7, 2, 2)
  //       }, {
  //         ...makeLineOperand("Line 2", 1660860000000 + 86400000, 0, 2.16e+7, 2, 3)
  //       }]
  //     }, {
  //       serieType: 4,
  //       operands: [{
  //         ...makeHistogramOperand("Histogram 1", 1660860000000 + 86400000, 50, 2.16e+7, 5, 5)
  //       }]
  //     }]
  //   }, {
  //     yAxisType: 3,
  //     series: [{
  //       serieType: 6,
  //       operands: [{
  //         ...makePlanningOperand("Planning 1", 1660860000000 + 86400000, ["", "Idle", "Cooling", "Warming"], 3)
  //       }]
  //     }]
  //   }]
  // },
  // chartData: {
  //   chartType: 1,
  //   xAxisType: 2,
  //   plots: [{
  //     yAxisType: 3,
  //     series: [{
  //       serieType: 8,
  //       operands: [{
  //         ...makeTopOperand("Top 1", ["Donald Duck", "Riri Duck", "Fifi Duck", "Loulou Duck", "Balthazar Picsou"], 100)
  //       }]
  //     }]
  //   }]
  // },
  // chartData: {
  //   chartType: 1,
  //   xAxisType: 3,
  //   plots: [{
  //     yAxisType: 2,
  //     series: [{
  //       serieType: 9,
  //       operands: [{
  //         ...makeBarsOperand("Bars 1", ["Grapefruit", "Pomelo", "Lime"], 100)
  //       }]
  //     }, {
  //       serieType: 10,
  //       operands: [{
  //         ...makeBarsOperand("Stacked bars 1", ["Grapefruit", "Apple"], 100)
  //       }]
  //     }]
  //   }]
  // },
  yAxisRanges: [
    { startValue: -3,   endValue: 0,  opacity: 0.2, color: "#ff0000", label: "Bad" },
    { startValue: 0,   endValue: 3,  opacity: 0.2, color: "#00ff00", label: "Good" },
  ],
  // heatRanges: [
  //   { startValue: -1500,   endValue: -3,  opacity: 1, color: "#0000ff", label: "Out of scope" },
  //   { startValue: -3,   endValue: 0,  opacity: 1, color: "#ff0000", label: "Bad" },
  //   { startValue: 0,   endValue: 3,  opacity: 1, color: "#00ff00", label: "Good" },
  //   { startValue: 3,   endValue: 1500,  opacity: 1, color: "#0000ff", label: "Out of scope" },
  // ]
};