import StackedBarsChart from '../components/examples/StackedBarsChart.vue';

export default {
  title: 'Example/StackedBarsChart/2',
  component: StackedBarsChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { StackedBarsChart },
  template:
    `<stacked-bars-chart
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
      :xAxisLabelsTooltipText="xAxisLabelsTooltipText"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :serieShowTooltip="serieShowTooltip"
      :serieTooltipText="serieTooltipText"
    />`,
});

const makeColumnSerie = (name, categories, rangeValue) => {
  var data = [];
  for (let i = 0; i < categories.length; i++) {
    data.push({
      categoryX: categories[i],
      categoryCodeX: categories[i],
      valueY: Math.floor(1 + Math.random() * rangeValue)
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
      { ...makeColumnSerie("Mission success", ["Captain America", "Iron Man", "Black panther", "Captain Marvel", "Ant-man", "Spider-Man", "Black widow", "Hulk", "Thor", "Hawkeye", "Scarlet witch", "Vision", "Doctor strange"], 10 ) }
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
  xAxisLabelsOversizedBehavior: "none",
  xAxisLabelsMaxWidth: 100,
  xAxisLabelsTooltipText: "{categoryX}",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  serieShowTooltip: true,
  serieTooltipText: "{name}: {dataItem.dataContext.valueY}"
};