import ScatterPlotChart from '../components/examples/ScatterPlotChartVV.vue';

export default {
  title: 'Example/ScatterPlotChart/Value - Value',
  component: ScatterPlotChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ScatterPlotChart },
  template:
    `<scatter-plot-chart
      :data="data"
      :height="height"
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
      :xAxisTooltipNumberFormat="xAxisTooltipNumberFormat"
      :xAxisRanges="xAxisRanges"
      :xAxisUnit="xAxisUnit"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :yAxisRanges="yAxisRanges"
      :yAxisUnit="yAxisUnit"
      :serieShowTooltip="serieShowTooltip"
      :serieTooltipText="serieTooltipText"
    />`,
});

const makeScatterPlotSerie = (name, minRange, maxRange, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    data.push({
      valueX: Math.floor(Math.random() * (maxRange - minRange)) + minRange,
      valueY: Math.floor(Math.random() * (maxRange - minRange)) + minRange,
      valueZ: Math.floor(Math.random() * (maxRange - minRange)) + minRange
    });
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
      { ...makeScatterPlotSerie("First furnace", 5, 30, 20 ) },
      { ...makeScatterPlotSerie("Second furnace", 10, 20, 10 ) },
    ]
  },
  height: '100vh',
  locale: "fr-FR",
  chartLayout: 2,
  colorSet: 5,
  colorSeed: "sigma",
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
  xAxisTooltipNumberFormat: "#,###.###### a",
  xAxisRanges: [
    { startValue: 0,   endValue: 15,  opacity: 0.2, color: "#0000ff", label: "Short" },
    { startValue: 15,  endValue: 30,  opacity: 0.2, color: "#000000", label: "Long" }
  ],
  xAxisUnit: "cm",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisRanges: [
    { startValue: 0,   endValue: 15,  opacity: 0.2, color: "#ff0000", label: "Empty" },
    { startValue: 15,   endValue: 30,  opacity: 0.2, color: "#00ffff", label: "Filled" },
  ],
  yAxisUnit: "mL",
  serieShowTooltip: true,
  serieTooltipText: "{name}: {dataItem.dataContext.valueZ}"
};