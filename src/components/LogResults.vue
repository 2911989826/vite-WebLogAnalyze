<template>
  <div class="LogResults">
    <h3>解析结果</h3>
    <el-form>
      <el-form-item>
        <el-input v-model="filters.ip" placeholder="过滤 IP 地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.keyword" placeholder="搜索关键词"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="applyFilters">筛选</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="paginatedData" style="width: 100%">
      <el-table-column prop="ip" label="IP 地址" width="120"></el-table-column>
      <el-table-column
        prop="timestamp"
        label="时间戳"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="method"
        label="请求方法"
        width="120"
      ></el-table-column>
      <el-table-column prop="url" label="URL" width="250"></el-table-column>
      <el-table-column
        prop="status"
        label="状态码"
        width="100"
      ></el-table-column>
      <!-- 添加其他需要显示的字段 -->
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="filteredData.length"
      @current-change="updatePagination"
    ></el-pagination>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "LogResults",
  props: {
    logData: {
      type: Object,
      default: () => ({
        entries: [],
        totalLines: 0,
      }),
    },
  },
  data() {
    return {
      filters: {
        ip: "",
        keyword: "",
      },
      currentPage: 1,
      pageSize: 10,
      sortBy: "",
      sortOrder: "",
    };
  },
  computed: {
    filteredData() {
      return this.entries.filter((entry) => {
        // 根据 IP 地址过滤
        if (this.filters.ip && entry.ip !== this.filters.ip) {
          return false;
        }

        // 根据关键词搜索
        if (this.filters.keyword && !entry.raw.includes(this.filters.keyword)) {
          return false;
        }

        return true;
      });
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
    ...mapState("log", ["entries", "totalLines"]),
    exampleComputedProperty() {
      // 这是一个其他的计算属性
      return this.totalLines * 2;
    },
  },
  methods: {
    applyFilters() {
      // 应用过滤器并重新渲染图表
      this.$refs.chart.renderChart();
    },
    onSortChange({ prop, order }) {
      this.sortBy = prop;
      this.sortOrder = order;
      this.sortData();
    },
    sortData() {
      this.filteredData.sort((a, b) => {
        let result;
        if (this.sortBy === "ip") {
          result = a.ip.localeCompare(b.ip);
        } else if (this.sortBy === "timestamp") {
          result = new Date(a.timestamp) - new Date(b.timestamp);
        } else if (this.sortBy === "status") {
          result = a.status - b.status;
        } else {
          return 0;
        }

        return this.sortOrder === "ascending" ? result : -result;
      });
    },
    updatePagination() {
      this.$refs.chart.renderChart();
    },
  },
};
</script>

<style>
</style>