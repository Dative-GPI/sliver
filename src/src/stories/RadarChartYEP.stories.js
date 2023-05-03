import RadarChart from '../components/examples/RadarChart.vue';

export default {
  title: 'Example/RadarChart/With ranges',
  component: RadarChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { RadarChart },
  template:
    `<radar-chart
      :minHeight="minHeight"
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
      :panX="panX"
      :panY="panY"
      :startAngle="startAngle"
      :endAngle="endAngle"
      :radius="radius"
      :axisMin="axisMin"
      :axisMax="axisMax"
      :ranges="ranges"
      :unit="unit"
      :firstName="firstName"
      :firstColorIndex="firstColorIndex"
      :firstPinRadius="firstPinRadius"
      :firstBottomWidth="firstBottomWidth"
      :firstClockHandRadius="firstClockHandRadius"
      :firstHandTooltipText="firstHandTooltipText"
      :firstHandTooltipX="firstHandTooltipX"
      :firstValue="firstValue"
      :secondClockHand="secondClockHand"
      :secondName="secondName"
      :secondColorIndex="secondColorIndex"
      :secondPinRadius="secondPinRadius"
      :secondBottomWidth="secondBottomWidth"
      :secondClockHandRadius="secondClockHandRadius"
      :secondHandTooltipText="secondHandTooltipText"
      :secondHandTooltipX="secondHandTooltipX"
      :secondValue="secondValue"
    />`,
});

export const Default = Template.bind({});
Default.args = {
  panX: false,
  panY: false,
  startAngle: 180,
  endAngle: 360,
  radius: 70,
  axisMin: 0,
  axisMax: 200,
  ranges: [
    { startValue: 0,   endValue: 40,  opacity: 0.5, color: "#ff3c3c", label: "Bad" },
    { startValue: 40,  endValue: 80,  opacity: 0.5, color: "#ff8c3c", label: "Somewhat bad" },
    { startValue: 80,  endValue: 120, opacity: 0.5, color: "#b4b4b4", label: "Just meh" },
    { startValue: 120, endValue: 160, opacity: 0.5, color: "#aaff64", label: "Somewhat good" },
    { startValue: 160, endValue: 200, opacity: 0.5, color: "#64ff8c", label: "Good" }
  ],
  unit: "mA",
  minHeight: '400px',
  locale: "fr-FR",
  colorSet: 5,
  colorSeed: "gauffrier",
  chartLayout: 2,
  legend: true,
  legendLayout: 0,
  legendPosition: 1,
  legendX: 50,
  legendCenterX: 50,
  legendY: 50,
  legendCenterY: 50,
  firstName: "Value 1",
  firstColorIndex: 0,
  firstPinRadius: 5,
  firstBottomWidth: 10,
  firstClockHandRadius: 95,
  firstHandTooltipText: "{name}: {value}",
  firstHandTooltipX: 95,
  firstValue: 50,
  secondClockHand: true,
  secondName: "Value 2",
  secondColorIndex: 1,
  secondPinRadius: 5,
  secondBottomWidth: 10,
  secondClockHandRadius: 95,
  secondHandTooltipText: "{name}: {value}",
  secondHandTooltipX: 95,
  secondValue: 15
};