import PlanningChart from '../components/examples/PlanningChart.vue';

export default {
  title: 'Example/PlanningChart2',
  component: PlanningChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PlanningChart },
  template:
    `<planning-chart
      :data="data"
      :minHeight="minHeight"
      :chartLayout="chartLayout"
      :legend="legend"
      :legendLayout="legendLayout"
      :legendPosition="legendPosition"
      :legendX="legendX"
      :legendCenterX="legendCenterX"
      :legendY="legendY"
      :legendCenterY="legendCenterY"
      :cursor="cursor"
      :cursorBehavior="cursorBehavior"
      :cursorXVisible="cursorXVisible"
      :cursorYVisible="cursorYVisible"
      :scrollbar="scrollbar"
      :scrollbarHeight="scrollbarHeight"
      :scrollbarStartGripVisible="scrollbarStartGripVisible"
      :scrollbarEndGripVisible="scrollbarEndGripVisible"
      :xAxisOpposite="xAxisOpposite"
      :xAxisShowTooltip="xAxisShowTooltip"
      :xAxisTooltipDateFormat="xAxisTooltipDateFormat"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisCellStartLocation="yAxisCellStartLocation"
      :yAxisCellEndLocation="yAxisCellEndLocation"
    />`,
});

const makePlanningSerie = (name, tZero, timeRange, categories, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    let categoryRandom = Math.floor(Math.random() * categories.length);
    let timeOffset = Math.floor(Math.random() * (timeRange + 60)) * 1000
    data.push({
      timestampX: tZero,
      closeTimestamp: tZero + timeOffset,
      categoryY: categories[categoryRandom]
    });

    tZero += timeOffset;
  }

  return {
    serie: name,
    data: data
  };
}

export const Default = Template.bind({});
Default.args = {
  data: {
    series: JSON.parse(`[{"serie":"TOURTE","data":[{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106529000,"closeTimestamp":1645106529000},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106529000,"closeTimestamp":1645106529000},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106529000,"closeTimestamp":1645108555074},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106529000,"closeTimestamp":1645108629000},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645117348000,"closeTimestamp":1645119076852},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645117348000,"closeTimestamp":1645119448000},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645117348000,"closeTimestamp":1645117348000},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645117348000,"closeTimestamp":1645117348000}]},{"serie":"Baguettes Paneo 250g","data":[{"categoryX":null,"categoryY":"4","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106536000,"closeTimestamp":1645127536000},{"categoryX":null,"categoryY":"4","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106536000,"closeTimestamp":1645107796000},{"categoryX":null,"categoryY":"4","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106536000,"closeTimestamp":1645107954028},{"categoryX":null,"categoryY":"4","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106536000,"closeTimestamp":1645107916000},{"categoryX":null,"categoryY":"1","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106567000,"closeTimestamp":1645127567000},{"categoryX":null,"categoryY":"1","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106567000,"closeTimestamp":1645107827000},{"categoryX":null,"categoryY":"1","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106567000,"closeTimestamp":1645107983336},{"categoryX":null,"categoryY":"1","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645106567000,"closeTimestamp":1645107947000}]},{"serie":"","data":[{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645118063000,"closeTimestamp":1645118764850},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645118063000,"closeTimestamp":1645118063000},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645118063000,"closeTimestamp":1645118063000},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645118063000,"closeTimestamp":1645118063000},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645118702000,"closeTimestamp":1645118702000},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645118702000,"closeTimestamp":1645118702000},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645118702000,"closeTimestamp":1645118702000},{"categoryX":null,"categoryY":"2","valueX":null,"valueY":null,"valueZ":null,"timestampX":1645118702000,"closeTimestamp":1645119337922}]}]`)
  },
  minHeight: '400px',
  chartLayout: 2,
  legend: true,
  legendLayout: 0,
  legendPosition: 1,
  legendX: 50,
  legendCenterX: 50,
  legendY: 50,
  legendCenterY: 50,
  cursor: true,
  cursorBehavior: "zoomX",
  cursorXVisible: true,
  cursorYVisible: true,
  scrollbar: true,
  scrollbarHeight: 5,
  scrollbarStartGripVisible: true,
  scrollbarEndGripVisible: true,
  xAxisOpposite: false,
  xAxisShowTooltip: true,
  xAxisTooltipDateFormat: "yyyy-MM-dd HH:mm",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisCellStartLocation: 0.5,
  yAxisCellEndLocation: 0.5
};