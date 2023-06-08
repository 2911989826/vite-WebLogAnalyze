<template>
  <div class="FileUploader">
    <el-upload
    class="upload"
    drag
    action="#"
    multiple
    :auto-upload="false"
    :show-file-list="false"
    @change="handleFileChange"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        上传不得超过 2048kb 的.log日志文件
      </div>
    </template>
  </el-upload>
  </div>
</template>
  
  <script>
import { UploadFilled } from '@element-plus/icons-vue'
import { parseLog } from "../utils/logParser.js";

export default {
  name: "FileUploader",
  components: {
    UploadFilled
  },
  methods: {
    handleFileChange(file) {
      console.log(file); // 检查 file 对象是否有效
      if (file && file.raw) {
        const maxSize = 20 * 1024 * 1024; // 20M

        if (file.raw.size > maxSize) {
          this.$message.error("文件大小超过20M，请上传较小的文件。");
          return;
        }

        // 读取文件内容
        const reader = new FileReader();
        reader.readAsText(file.raw, "UTF-8");

        // 文件读取完成后解析日志
        reader.onload = (event) => {
          const fileContent = event.target.result;

          // 使用 parseLog 函数解析日志内容
          // 使用 parseLog 函数解析日志内容
          const { entries, totalLines } = parseLog(fileContent);

          // 使用 Vuex action 更新日志数据
          this.$store.dispatch("log/updateLogData", { entries, totalLines });

          console.log("解析结果:", entries);
          console.log("总行数:", totalLines);
          // 处理解析后的日志数据，例如显示在表格中、进行统计分析等
        };

        // 文件读取过程中发生错误
        reader.onerror = (error) => {
          console.error("读取文件错误:", error);
          this.$message.error("读取文件时发生错误，请重试。");
        };
      } else {
        console.error("未找到上传的文件。");
      }
    },
  },
};
</script>
  
<style scoped>
.upload{
    width: 100%;
}
@media (min-width: 768px) {
  .upload {
    width: 30%;
    margin: auto;
  }
}
</style>