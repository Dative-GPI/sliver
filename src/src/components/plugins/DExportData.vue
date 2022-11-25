<template>
  <div ref="exportdata" :id="'exportdata'">
    <slot> </slot>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";

import * as am5 from "@amcharts/amcharts5";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

@Component({})
export default class DExportData extends Vue {
  @Prop({ required: true })
  data!: any;

  @Prop({ required: false, default: "Data" })
  prefix!: string;

  root: am5.Root | null = null;
  exporting: am5plugins_exporting.Exporting | null = null;

  mounted(): void {
    // Create root
    this.root = am5.Root.new((this.$refs.exportdata as HTMLElement));
    this.root.autoResize = false;

    this.exporting = am5plugins_exporting.Exporting.new(this.root, {
      menu: am5plugins_exporting.ExportingMenu.new(this.root, {}),
      pngOptions: { disabled: true },
      jpgOptions: { disabled: true },
      pdfOptions: { disabled: true },
      pdfdataOptions: { disabled: true },
      htmlOptions: { disabled: true },
      printOptions: { disabled: true },
      dataSource: this.data,
      filePrefix: this.prefix
    });
  }
}
</script>