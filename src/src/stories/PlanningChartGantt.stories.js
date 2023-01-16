import PlanningChart from '../components/examples/PlanningChart.vue';

export default {
  title: 'Example/PlanningChart/Gantt',
  component: PlanningChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PlanningChart },
  template:
    `<planning-chart
      :data="data"
      :minHeight="minHeight"
      :locale="locale"
      :colorSet="colorSet"
      :colorSeed="colorSeed"
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
      :templateWidth="templateWidth"
      :templateCornerRadius="templateCornerRadius"
    />`,
});

const makePlanningSerie = (name, tZero, timeRange, categories, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    let categoryRandom = Math.floor(Math.random() * categories.length);
    let timeOffset = (Math.floor(Math.random() * (timeRange)) + 60) * 1000
    data.push({
      timestampX: tZero,
      closeTimestampX: tZero + timeOffset,
      categoryY: categories[categoryRandom],
      categoryCodeY: categories[categoryRandom]
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
      { ...makePlanningSerie("Production", 1577836800000, 0, ["Line [[1]]", "Line 2", "Line 2"], 10 ) },
      { ...makePlanningSerie("Idle", 1577836800000, 0, ["Line [1]", "Line 2"], 10 ) },
      { ...makePlanningSerie("Cooling", 1577836800000, 0, ["Line [1]", "Line 2"], 10 ) },
      { ...makePlanningSerie("Warming", 1577836800000, 0, ["Line [1]", "Line 2"], 10 ) }
    ]
  },
  minHeight: '400px',
  locale: "fr-FR",
  colorSet: 5,
  colorSeed: "gamma",
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
  xAxisTooltipDateFormat: "yyyy-MM-dd HH:mm:ss",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisCellStartLocation: 0.5,
  yAxisCellEndLocation: 0.5,
  templateWidth: undefined,
  templateCornerRadius: 10
};