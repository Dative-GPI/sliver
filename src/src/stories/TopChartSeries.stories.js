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
      :xAxisTooltipNumberFormat="xAxisTooltipNumberFormat"
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
      categoryCodeY: name + "-" + categories[i],
      valueX: Math.floor(Math.random() * rangeValue)
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
      { ...makeColumnSerie("Delta", ["Marcus Phoenix", "Dominic Santiago", "Augustus Cole", "Damon Baird"], 100 ) },
      { ...makeColumnSerie("Charlie", ["Marcus Phoenix", "Anthony Carmine", "Benjamin Carmine", "Clay Carmine"], 100 ) }
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
  xAxisTooltipNumberFormat: "#",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipText: "{categoryY}",
  yAxisCellStartLocation: 0.5,
  yAxisCellEndLocation: 0.5,
  yAxisLabelsOversizedBehavior: "truncate",
  yAxisLabelsMaxWidth: 100,
  serieShowTooltip: true,
  serieTooltipText: "{dataItem.dataContext.categoryY}: {dataItem.dataContext.valueX}"
};