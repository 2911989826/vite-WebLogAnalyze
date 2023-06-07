<template>
  <div class="Home">
    <h1>网站.log日志分析工具</h1>
    <FileUploader/>
    <LogResults/>
  </div>
</template>

<script>
import FileUploader from '../components/FileUploader.vue'
import LogResults from '../components/LogResults.vue'
import { parseLog } from '../utils/logParser.js';
export default {
  name: 'Home',
  components: {
    FileUploader,
    LogResults,
  },
  data() {
    return {
      logData: {},
    };
  },
  methods: {
    handleFileLoaded(fileContent) {
      this.logData = parseLog(fileContent);
    },
  },
};
</script>

<style>

</style>