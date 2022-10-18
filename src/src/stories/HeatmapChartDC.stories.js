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
      :minHeight="minHeight"
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
      :minColor="minColor"
      :maxColor="maxColor"
      :selection="selection"
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
        valueZ: Math.floor(Math.random() * rangeValue)
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
      { ...makeHeatmapSerie("Occupancy", 1661817600000, 3600000, ["Dawn", "Morning", "Afternoon", "Evening", "Night"], 150000, 7) }
    ]
  },
  minHeight: '400px',
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
  minColor: "#00ffff",
  maxColor: "#ff0000",
  selection: [null, null]
};