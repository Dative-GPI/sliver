import ScatterPlotChart from '../components/examples/ScatterPlotChartCV.vue';

export default {
  title: 'Example/ScatterPlotChart/Category - Value',
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
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :serieShowTooltip="serieShowTooltip"
      :serieTooltipText="serieTooltipText"
    />`,
});

const makeScatterPlotSerie = (name, categories, minRange, maxRange, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    let categoryRandom = Math.floor(Math.random() * categories.length);
    data.push({
      categoryX: categories[categoryRandom],
      categoryCodeX: categories[categoryRandom],
      valueY: Math.floor(Math.random() * (maxRange - minRange)) + minRange,
      valueZ: (Math.floor(Math.random() * (maxRange - minRange)) + minRange) * 10
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
      { ...makeScatterPlotSerie("Recettes", ["Croissants", "Baguettes", "Pains", "Gauffres", "Miches"], 5, 200, 150 ) }
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
  xAxisTooltipText: "{categoryX}",
  xAxisLabelsOversizedBehavior: "truncate",
  xAxisLabelsMaxWidth: 100,
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#",
  serieShowTooltip: true,
  serieTooltipText: "{dataItem.dataContext.categoryX}: {dataItem.dataContext.valueZ}"
};