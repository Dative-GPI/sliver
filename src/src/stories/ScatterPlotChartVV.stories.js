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
      :xAxisTooltipNumberFormat="xAxisTooltipNumberFormat"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
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
  xAxisTooltipNumberFormat: "#",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#"
};