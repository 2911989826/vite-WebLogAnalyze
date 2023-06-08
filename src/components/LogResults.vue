<template>
  <div class="LogResults">
    <h2>解析结果<List /></h2>
    <el-form>
      <el-form-item>
        <el-input v-model="filters.ip" placeholder="过滤 IP 地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="filters.dateRange"
          type="datetimerange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
        />
      </el-form-item>
      <el-form-item>
        <el-cascader
          v-model="filters.method"
          :options="methods"
          placeholder="请求方式"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.url" placeholder="过滤 URL 地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-cascader
          v-model="engine"
          :options="options"
          @change="applyFilters"
          placeholder="搜索引擎"
        />
      </el-form-item>
      <el-form-item>
        <el-cascader
          v-model="filters.status"
          :options="statusCodes"
          placeholder="状态码"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="applyFilters"
          ><Search />&nbsp;&nbsp;查询</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="paginatedData" style="width: 100%">
      <el-table-column prop="ip" label="IP 地址" width="120"></el-table-column>
      <el-table-column prop="timestamp" label="时间戳"></el-table-column>
      <el-table-column prop="method" label="请求方法"></el-table-column>
      <el-table-column prop="url" label="URL" width="250"></el-table-column>
      <el-table-column prop="userAgent" label="User-Agent"> </el-table-column>
      <el-table-column prop="status" label="状态码"></el-table-column>
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
import { Search } from "@element-plus/icons-vue";
import { List } from "@element-plus/icons-vue";

export default {
  name: "LogResults",
  components: {
    Search,
    List,
  },
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
        dateRange: [],
        method: "",
        url: "",
        status: "",
      },
      currentPage: 1,
      pageSize: 10,
      sortBy: "",
      sortOrder: "",
      methods: [
        { value: "GET", label: "GET" },
        { value: "POST", label: "POST" },
        { value: "PUT", label: "PUT" },
        { value: "DELETE", label: "DELETE" },
        { value: "PATCH", label: "PATCH" },
        { value: "HEAD", label: "HEAD" },
      ],
      statusCodes: [
        { value: "200", label: "200" },
        { value: "201", label: "201" },
        { value: "204", label: "204" },
        { value: "400", label: "400" },
        { value: "401", label: "401" },
        { value: "403", label: "403" },
        { value: "404", label: "404" },
        { value: "500", label: "500" },
        { value: "502", label: "502" },
        { value: "503", label: "503" },
      ],
      engine: "",
      options: [
        { value: "Google", label: "Google" },
        { value: "Baidu", label: "Baidu" },
        { value: "Bing", label: "Bing" },
        { value: "Sogou", label: "Sogou" },
        { value: "360", label: "360" },
      ],
      filterLogs: [],
      searchEngines: [
        {
          name: "Bing",
          regex: /bingbot\/2\.0/,
        },
        {
          name: "Google",
          regex: /Googlebot/,
        },
        {
          name: "Baidu",
          regex: /Baiduspider/,
        },
        {
          name: "Sogou",
          regex: /Sogou\s?Spider/,
        },
        {
          name: "360",
          regex: /360Spider/,
        },
        // 其他搜索引擎...
      ],
    };
  },
  computed: {
    filteredData() {
      return this.entries.filter((entry) => {
        // 根据 IP 地址过滤
        if (this.filters.ip && entry.ip !== this.filters.ip) {
          return false;
        }

        // 根据时间范围过滤
        if (
          this.filters.dateRange.length === 2 &&
          (new Date(entry.timestamp) < this.filters.dateRange[0] ||
            new Date(entry.timestamp) > this.filters.dateRange[1])
        ) {
          return false;
        }

        // 根据请求方法过滤
        if (this.filters.method && entry.method !== this.filters.method) {
          return false;
        }

        // 根据 URL 地址过滤
        if (this.filters.url && !entry.url.includes(this.filters.url)) {
          return false;
        }

        // 根据状态码过滤
        if (
          this.filters.status &&
          entry.status !== parseInt(this.filters.status, 10)
        ) {
          return false;
        }

        // 根据搜索引擎过滤
        if (
          this.filters.uaRegex &&
          !this.filters.uaRegex.test(entry.userAgent)
        ) {
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
    // exampleComputedProperty() {
    //   // 这是一个其他的计算属性
    //   return this.totalLines * 2;
    // },
  },
  methods: {
    applyFilters() {
      // 应用过滤器并重新渲染图表
      this.filterByEngine();
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
    filterByEngine() {
      // Filter by User Agent (UA) if a search engine is selected
      if (this.engine) {
        const selectedEngine = this.searchEngines.find(
          (engine) => engine.name === this.engine
        );
        if (selectedEngine) {
          this.filters.uaRegex = selectedEngine.regex;
        } else {
          this.filters.uaRegex = null;
        }
      } else {
        this.filters.uaRegex = null;
      }
    },
  },
};
</script>

<style scoped>
.LogResults > h2:nth-child(1) {
  display: flex;
  align-items: center;
}
.el-form-item__content button span svg,
h2 svg {
  width: 1em;
  height: 1em;
}
.el-form {
  display: flex;
  align-items: center;
}
.el-form-item {
  margin-right: 1.3rem;
}
</style>