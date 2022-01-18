import StackedBarsChart from '../components/examples/StackedBarsChart.vue';

export default {
  title: 'Example/StackedBarsChart',
  component: StackedBarsChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { StackedBarsChart },
  template:
    `<stacked-bars-chart
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
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
    />`,
});

const makeColumnSerie = (name, categories, rangeValue) => {
  var data = [];
  for (let i = 0; i < categories.length; i++) {
    data.push({
      categoryX: categories[i],
      valueY: Math.floor(Math.random() * rangeValue)
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
      { ...makeColumnSerie("Grapefruit", ["First farm", "Second farm", "Third farm"], 50 ) },
      { ...makeColumnSerie("Coconut", ["First farm", "Second farm", "Third farm"], 100 ) },
      { ...makeColumnSerie("Pineapple", ["First farm", "Second farm", "Third farm"], 50 ) }
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
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#"
};