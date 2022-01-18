import PlanningChart from '../components/examples/PlanningChart.vue';

export default {
  title: 'Example/PlanningChart',
  component: PlanningChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PlanningChart },
  template:
    `<planning-chart
      :data="data"
      :legend="legend"
      :legendX="legendX"
      :legendCenterX="legendCenterX"
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
    series: [
      { ...makePlanningSerie("Line 1", 1640815320000, 360, ["Production", "Idle", "Cooling", "Warming"], 50 ) },
      { ...makePlanningSerie("Line 2", 1640815320000, 360, ["Production", "Idle", "Cooling", "Warming"], 50 ) }
    ]
  },
  legend: true,
  legendX: 50,
  legendCenterX: 50,
  cursor: true,
  cursorBehavior: "zoomXY",
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
  yAxisShowTooltip: true
};