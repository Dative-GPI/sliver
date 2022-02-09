import PieChart from '../components/examples/PieChart.vue';

export default {
  title: 'Example/PieChart/Exploding',
  component: PieChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PieChart },
  template:
    `<pie-chart
      :data="data"
      :minHeight="minHeight"
      :vertical="vertical"
      :legend="legend"
      :legendX="legendX"
      :legendCenterX="legendCenterX"
      :legendY="legendY"
      :legendCenterY="legendCenterY"
      :breakDownSlices="breakDownSlices"
      :breakDownSlicesSubname="breakDownSlicesSubname"
    />`,
});

const makeExplodingPieSerie = (name, categories, subCategories, rangeValue) => {
  var data = [];
  for (let i = 0; i < categories.length; i++) {
    let parentCategory = {
      categoryX: categories[i],
      valueY: 0,
      subs: []
    };
    for (let j = 0; j < subCategories.length; j++) {
      parentCategory.subs.push({
        categoryX: subCategories[j],
        valueY: Math.floor(Math.random() * rangeValue)
      });
    }
    parentCategory.valueY = parentCategory.subs.reduce((acc, cur) => acc + cur.valueY, 0);

    data.push(parentCategory);
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
      { ...makeExplodingPieSerie("Expenses", ["First company", "Second company"], ["Employees well-being", "Dividends", "Tax fraud"], 500 ) }
    ]
  },
  minHeight: '400px',
  vertical: true,
  legend: true,
  legendX: 50,
  legendCenterX: 50,
  legendY: 50,
  legendCenterY: 50,
  breakDownSlices: true,
  breakDownSlicesSubname: "subs"
};