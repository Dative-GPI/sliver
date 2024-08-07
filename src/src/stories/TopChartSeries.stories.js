import TopChart from '../components/examples/TopChart.vue';

export default {
  title: 'Example/TopChart/Series',
  component: TopChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TopChart },
  template:
    `<top-chart
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
      :yAxisTooltipText="yAxisTooltipText"
      :yAxisCellStartLocation="yAxisCellStartLocation"
      :yAxisCellEndLocation="yAxisCellEndLocation"
      :yAxisLabelsOversizedBehavior="yAxisLabelsOversizedBehavior"
      :yAxisLabelsMaxWidth="yAxisLabelsMaxWidth"
      :serieShowTooltip="serieShowTooltip"
      :serieTooltipText="serieTooltipText"
    />`,
});

const makeColumnSerie = (name, categories, rangeValue) => {
  var data = [];
  for (let i = 0; i < categories.length; i++) {
    data.push({
      categoryY: categories[i],
      categoryCodeY: categories[i],
      valueX: Math.floor((Math.random() * rangeValue)) + 2
    });
  }

  return {
    serie: name,
    data: data
  };
}

const processColumnSeries = (series) => {
  series = series.sort((a, b) => a.serie > b.serie ? 1 : -1);
  series[0].data.forEach(data => {
    data.selfValueX = data.valueX
    data.closeValueX = data.valueX;
    data.valueX = 0;
  });

  if (series.length > 1) {
    for (let i = 1; i < series.length; i++) {
      series[i].data.forEach(data => {
        let previous = series[i - 1].data.find(d => d.categoryCodeY == data.categoryCodeY);
        if (previous != null) {
          data.selfValueX = data.valueX;
          data.closeValueX = data.valueX + previous.closeValueX;
          data.valueX = previous.closeValueX;
        }
        else {
          data.selfValueX = data.valueX
          data.closeValueX = data.valueX;
          data.valueX = 0;
        }
      });
    }
  }
  return series;
}

export const Default = Template.bind({});
Default.args = {
  data: {
    series:
      processColumnSeries([
        { ...makeColumnSerie("Delta", ["Marcus Phoenix", "Dominic Santiago", "Damon Baird", "Augustus Cole"], 100 ) },
        { ...makeColumnSerie("Charlie", ["Anthony Carmine", "Benjamin Carmine", "Clay Carmine"], 100 ) }
      ])
  },
  height: '100vh',
  locale: "fr-FR",
  colorSet: 5,
  colorSeed: "tango delta",
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
  xAxisTooltipNumberFormat: "#,###.###### a",
  xAxisRanges: [
    { startValue: 0,   endValue: 20,  opacity: 0.5, color: "#ff3c3c", label: "Bad" },
    { startValue: 20,  endValue: 40,  opacity: 0.5, color: "#ff8c3c", label: "Somewhat bad" },
    { startValue: 40,  endValue: 60, opacity: 0.5, color: "#b4b4b4", label: "Just meh" },
    { startValue: 60, endValue: 80, opacity: 0.5, color: "#aaff64", label: "Somewhat good" },
    { startValue: 80, endValue: 100, opacity: 0.5, color: "#64ff8c", label: "Good" }
  ],
  xAxisUnit: "kills",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipText: "{categoryY}",
  yAxisCellStartLocation: 0.5,
  yAxisCellEndLocation: 0.5,
  yAxisLabelsOversizedBehavior: "truncate",
  yAxisLabelsMaxWidth: 100,
  serieShowTooltip: true,
  serieTooltipText: "{dataItem.dataContext.categoryY}: {dataItem.dataContext.selfValueX}"
};