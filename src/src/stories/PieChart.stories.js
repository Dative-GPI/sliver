import PieChart from '../components/examples/PieChart.vue';

export default {
  title: 'Example/PieChart',
  component: PieChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PieChart },
  template:
    `<pie-chart
      :data="data"
      :legend="legend"
      :legendX="legendX"
      :legendCenterX="legendCenterX"
    />`,
});

const makePieSerie = (name, categories, rangeValue) => {
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
      { ...makePieSerie("Categories", ["Pineapple", "Orange", "Cherry", "Strawberry", "Watermelon"], 500 ) }
    ]
  },
  legend: true,
  legendX: 50,
  legendCenterX: 50
};