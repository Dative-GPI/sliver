<template>
  <div>
    <slot v-if="upAndRunning"> </slot>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, InjectReactive, Prop, Vue, Watch } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

import { AMROOT, CHART, LEGEND, SERIE } from "../../literals";
import { ColorSets, GetHashedColor } from "@/colors";
import { uuidv4 } from "../../helpers";

@Component({})
export default class DPieSlice extends Vue {
  @InjectReactive(AMROOT)
  root!: am5.Root;

  @InjectReactive(CHART)
  chart!: am5percent.PieChart;

  @InjectReactive(LEGEND)
  legend!: am5.Legend | null;

  @InjectReactive(SERIE)
  serie!: am5percent.PieSeries;

  @Prop({ required: false, default: "categoryX" })
  categoryField!: string;

  @Prop({ required: false, default: "valueY" })
  valueField!: string;

  @Prop({ required: false, default: 0 })
  allSlicesSum!: number;

  @Watch("allSlicesSum")
  onAllSlicesSumChange = this.setData;

  @Prop({ required: false, default: "Other" })
  otherLabel!: string;

  @Watch("otherLabel")
  onOtherLabelChange = this.setData;

  @Prop({ required: false, default: 20 })
  otherThreshold: number | undefined;

  @Watch("otherThreshold")
  onOtherThresholdChange = this.setData;

  @Prop({ required: false, default: ColorSets.Default })
  colorSet!: ColorSets;

  @Watch("colorSet")
  onColorSetChange = this.setData;

  @Prop({ required: false, default: "" })
  colorSeed!: string;

  @Watch("colorSeed")
  onColorSeedChange = this.setData;

  @Prop({ required: true })
  data!: any[];

  @Watch("data")
  onDataChange = this.setData;

  @Prop({ required: true, default: null })
  clickedData!: { key: number, id: string } | null;

  @Watch("clickedData")
  onClickedDataChange = this.setClickedData;

  upAndRunning: boolean = false;
  guid: string = uuidv4();

  dataWithIds: any[] = [];
  localData: any[] = [];

  get trueOtherThreshold(): number {
    if (this.otherThreshold != null && this.otherThreshold > 0) {
      let sum = Math.max(this.allSlicesSum, this.data.reduce((acc: number, cur: any) => acc + cur[this.valueField], 0));
      return (sum / 100) * this.otherThreshold;
    }
    return 0;
  }

  setData(): void {
    this.dataWithIds = this.data.filter(d => d[this.valueField] > 0).map(d => {
      let dataId = uuidv4();
      let dataWithIds = {
        ...d,
        serieId: this.guid,
        dataId: dataId,
        parentId: null,
        topDownValues: [d[this.valueField]],
        topDownIds: [dataId],
        index: -1
      };
      dataWithIds.subs = this.setSubs(dataWithIds);
      return dataWithIds;
    });
    this.localData = _.cloneDeep(this.dataWithIds);
  }

  setSubs(data: any): any[] | null {
    if (data.subs != null && data.subs.length > 0) {
      if (this.otherThreshold != null && this.otherThreshold > 0) {
        let otherData: any = null;
        let others = data.subs.filter((s: any) => s[this.valueField] < this.trueOtherThreshold);
        if (others.length > 0) {
          let otherDataId = uuidv4();
          let otherDataValue = others.reduce((acc: number, cur: any) => acc + cur[this.valueField], 0);
          otherData = {
            [this.categoryField]: this.otherLabel,
            [this.valueField]: otherDataValue,
            serieId: this.guid,
            dataId: otherDataId,
            parentId: data.dataId,
            topDownValues: data.topDownValues.concat(otherDataValue),
            topDownIds: data.topDownIds.concat(otherDataId),
            index: -1
          };
          otherData.subs = others.map((o: any) => {
            let otherSubDataId = uuidv4();
            let otherSubData = {
              ...o,
              serieId: this.guid,
              dataId: otherSubDataId,
              parentId: otherData.dataId,
              topDownValues: otherData.topDownValues.concat(o[this.valueField]),
              topDownIds: otherData.topDownIds.concat(otherSubDataId),
              index: -1,
            }
            otherSubData.subs = this.setSubs(otherSubData);
            return otherSubData;
          });
        }
        let notOtherData: any[] = [];
        let notOthers = data.subs.filter((s: any) => s[this.valueField] >= this.trueOtherThreshold);
        if (notOthers.length > 0) {
          notOtherData = notOthers.map((s: any) => {
            let subDataId = uuidv4();
            let subData = {
              ...s,
              serieId: this.guid,
              dataId: subDataId,
              parentId: data.dataId,
              topDownValues: data.topDownValues.concat(s[this.valueField]),
              topDownIds: data.topDownIds.concat(subDataId),
              index: -1
            };
            subData.subs = this.setSubs(subData);
            if (subData.subs != null) {
              subData.subs = subData.subs.filter((d: any) => d[this.valueField] > 0);
            }
            return subData;
          });
        }
        if (otherData != null) {
          notOtherData.push(otherData);
        }
        return notOtherData.filter((d: any) => d[this.valueField] > 0);
      }
      else {
        return data.subs.map((s: any) => {
          let subDataId = uuidv4();
          let subData = {
            ...s,
            serieId: this.guid,
            dataId: subDataId,
            parentId: data.dataId,
            topDownValues: data.topDownValues.concat(s[this.valueField]),
            topDownIds: data.topDownIds.concat(subDataId),
            index: -1
          };
          subData.subs = this.setSubs(subData);
          if (subData.subs != null) {
            subData.subs = subData.subs.filter((d: any) => d[this.valueField] > 0);
          }
          return subData;
        }).filter((d: any) => d[this.valueField] > 0);
      }
    }
    return null;
  }

  setClickedData(newValue: { key: number, id: string }): void {
    let current = _.cloneDeep(this.localData);
    let index = current.findIndex((d: any) => d.dataId === newValue.id);
    if (index !== -1) {

      let data = current[index];
      if (data != null) {
        if (data.subs != null && data.subs.length > 0) {
          let flat = data.subs.map((s: any) => ({
            ...s,
            index: (this.serie!.data.values.find((v: any) => v.dataId === data.dataId)! as any).index
          }));
          current.forEach((d: any) => {
            d.index = (this.serie!.data.values.find((v: any) => v.dataId === d.dataId)! as any).index;
          });
          current.splice(index, 1, ...flat);
          this.localData = current;
        }
        else {
          this.localData = _.cloneDeep(this.dataWithIds);
        }
      }
    }
    else {
      this.localData = _.cloneDeep(this.dataWithIds);
    }
  }

  @Watch("localData", { deep: true })
  sendData(): void {
    // Remove from legend
    if (this.legend) {
      this.serie!.dataItems.forEach((dataItem: any) => {
        this.legend!.data.removeValue(dataItem);
      });
    }

    let colors: number[] = [];
    this.serie!.data.setAll(
      _.cloneDeep(this.serie!.data.values)
        .filter(d => (d as any).serieId !== this.guid)
        .concat(this.localData)
        .sort(this.sortData)
        .map((c: any, i: number) => {
          if ([ColorSets.Hash].includes(this.colorSet)) {
            let color = GetHashedColor(this.colorSeed, c[this.categoryField]);
            colors.push(color.hex);
            return { ...c, color, index: i };
          }
          else {
            let offset = 0;
            let color = this.serie!.get("colors")!.getIndex(offset);
            while (colors.includes(color.hex)) {
              offset++;
              color = this.serie!.get("colors")!.getIndex(offset);
            }
            colors.push(color.hex);
            return { ...c, color, index: i };
          }
        })
    );
    if (this.legend != null) {
      this.legend!.data.setAll(this.serie!.dataItems);
    }
  }

  sortData(a: any, b: any): number {
    if (a.index !== -1 && b.index !== -1 && a.index !== b.index) {
      return a.index - b.index;
    }
    for (let i = 0; i < Math.min(a.topDownValues.length, b.topDownValues.length); i++) {
      if (a.topDownValues[i] > b.topDownValues[i]) {
        return -1;
      }
      if (a.topDownValues[i] < b.topDownValues[i]) {
        return 1;
      }
    }
    if (a.topDownValues.length === b.topDownValues.length) {
      return a[this.valueField] > b[this.valueField] ? -1 : 1;
    }
    return a[this.categoryField] > b[this.categoryField] ? 1 : -1;
  }

  mounted(): void {
    this.setData();
    this.upAndRunning = true;
  }

  destroyed(): void {
    let copy = _.cloneDeep(this.serie!.data.values);
    copy = copy.filter(d => (d as any).serieId !== this.guid);
    this.serie!.data.setAll(copy);
  }
}
</script>