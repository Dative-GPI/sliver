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
      :minHeight="minHeight"
      :locale="locale"
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
      :xAxisTooltipText="xAxisTooltipText"
      :xAxisLabelsOversizedBehavior="xAxisLabelsOversizedBehavior"
      :xAxisLabelsMaxWidth="xAxisLabelsMaxWidth"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipText="yAxisTooltipText"
      :yAxisLabelsOversizedBehavior="yAxisLabelsOversizedBehavior"
      :yAxisLabelsMaxWidth="yAxisLabelsMaxWidth"
      :serieShowTooltip="serieShowTooltip"
      :serieTooltipText="serieTooltipText"
    />`,
});

const makeScatterPlotSerie = (name, categoriesX, categoriesY, minRange, maxRange, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    let categoryXRandom = Math.floor(Math.random() * categoriesX.length);
    let categoryYRandom = Math.floor(Math.random() * categoriesY.length);
    data.push({
      categoryX: categoriesX[categoryXRandom],
      categoryCodeX: categoriesX[categoryXRandom],
      categoryY: categoriesY[categoryYRandom],
      categoryCodeY: categoriesY[categoryYRandom],
      valueZ: (Math.random() * (maxRange - minRange)) + minRange
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
  minHeight: '400px',
  locale: "fr-FR",
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
  xAxisTooltipText: "{dataItem.dataContext.categoryX}",
  xAxisLabelsOversizedBehavior: "truncate",
  xAxisLabelsMaxWidth: 100,
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipText: "{dataItem.dataContext.categoryY}",
  yAxisLabelsOversizedBehavior: "truncate",
  yAxisLabelsMaxWidth: 100,
  serieShowTooltip: true,
  serieTooltipText: "{dataItem.dataContext.categoryX}: {dataItem.dataContext.valueZ}"
};