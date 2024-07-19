import HeatmapChart from '../components/examples/HeatmapChartDC.vue';

export default {
  title: 'Example/HeatmapChart/Date - Category',
  component: HeatmapChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { HeatmapChart },
  template:
    `<heatmap-chart
      :data="data"
      :height="height"
      :locale="locale"
      :chartLayout="chartLayout"
      :legend="legend"
      :legendPosition="legendPosition"
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
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :yAxisCellStartLocation="yAxisCellStartLocation"
      :yAxisCellEndLocation="yAxisCellEndLocation"
      :heatRule="heatRule"
      :minColor="minColor"
      :maxColor="maxColor"
      :minValue="minValue"
      :maxValue="maxValue"
      :heatRanges="heatRanges"
    />`,
});

const makeHeatmapSerie = (name, tZero, elapsedTime, categoriesY, rangeValue, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    for (let j = 0; j < categoriesY.length; j++) {
      data.push({
        timestampX: tZero,
        closeTimestampX: tZero + elapsedTime,
        categoryY: categoriesY[j],
        categoryCodeY: name + "-" + categoriesY[j],
        valueZ: Math.floor(Math.random() * rangeValue) - 100
      });
    }

    tZero += elapsedTime;
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
      { ...makeHeatmapSerie("Occupancy", 1670771609000, 28800000, ["Dawn", "Morning", "Afternoon", "Evening", "Night"], 600, 24) }
    ]
  },
  height: '100vh',
  locale: "fr-FR",
  chartLayout: 2,
  legend: true,
  legendPosition: 1,
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
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisCellStartLocation: 0,
  yAxisCellEndLocation: 1,
  heatRule: 1,
  minColor: "#00ffff",
  maxColor: "#ff0000",
  minValue: "",
  maxValue: 200,
  heatRanges: [
    { startValue: 0, endValue: 200, color: "#ff0000", opacity: 1, label: "Low" },
    { startValue: 200, endValue: 400, color: "#0000ff", opacity: 1, label: "Medium" },
    { startValue: 200, endValue: 600, color: "#00ff00", opacity: 1, label: "High" }
  ]
};