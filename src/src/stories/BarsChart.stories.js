import BarsChart from '../components/examples/BarsChart.vue';

export default {
  title: 'Example/BarsChart',
  component: BarsChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { BarsChart },
  template:
    `<bars-chart
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
      { ...makeColumnSerie("Line 1", ["Pineapple", "Grapefruit", "Coconut", "Passion fruit", "Banana"], 50 ) },
      { ...makeColumnSerie("Line 2", ["Pineapple", "Grapefruit", "Apple", "Peach", "Pear"], 100 ) }
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