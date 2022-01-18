import ScatterPlotChart from '../components/examples/ScatterPlotChartCC.vue';

export default {
  title: 'Example/ScatterPlotChart/Category - Category',
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
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
    />`,
});

const makeScatterPlotSerie = (name, categoriesX, categoriesY, minRange, maxRange, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    let categoryXRandom = Math.floor(Math.random() * categoriesX.length);
    let categoryYRandom = Math.floor(Math.random() * categoriesY.length);
    data.push({
      categoryX: categoriesX[categoryXRandom],
      categoryY: categoriesY[categoryYRandom],
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
      { ...makeScatterPlotSerie("First furnace", ["Baguettes", "Croissants", "Pains"], ["Tradition", "Graines", "Blé complet"], 5, 30, 4 ) },
      { ...makeScatterPlotSerie("Second furnace", ["Baguettes", "Croissants", "Pains"], ["Tradition", "Graines", "Blé complet"], 10, 20, 4 ) },
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