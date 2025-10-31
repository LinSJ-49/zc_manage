<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="课程名称">
        <el-input v-model="queryForm.name" placeholder="请输入课程名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="success" @click="add">新增课程</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="课程名称"></el-table-column>
      <el-table-column prop="description" label="课程描述"></el-table-column>
      <el-table-column prop="credit" label="学分"></el-table-column>
      <el-table-column fixed="right" label="操作" width="140">
        <template #default="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="confirmDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog v-model="dialogVisible" title="课程信息">
      <el-form :model="form">
        <el-form-item label="课程名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="学分">
          <el-input v-model="form.credit"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { searchCoursesApi,queryPageApi, addApi, queryInfoApi, updateApi, deleteApi } from '@/api/course'

export default {
  data() {
    return {
      queryForm: {
        name: ''
      },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      form: {}
    }
  },
  created() {
    this.query()
  },
  methods: {
    async query() {
  try {
    let res;
    if (this.queryForm.name) {
      // 模糊查询
      res = await searchCoursesApi(this.queryForm.name);
    } else {
      // 获取全部数据
      res = await queryPageApi(this.currentPage, this.pageSize, '');
    }

    if (res) {
      // 处理现有响应格式
      let records = [];
      let total = 0;

      if (Array.isArray(res)) {  // 直接返回数组的情况
        records = res;
        total = res.length;
      } else if (res.records !== undefined && res.total !== undefined) {  // 包含 records 和 total 的情况
        records = res.records;
        total = res.total;
      }

      this.tableData = records;
      this.total = total;
    } else {
      console.error('Invalid response format:', res);
      this.tableData = [];
      this.total = 0;
    }
  } catch (error) {
    console.error('Request failed:', error);
    this.tableData = [];
    this.total = 0;
  }
},

    handleSizeChange(val) {
      this.pageSize = val
      this.query()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.query()
    },
    add() {
      this.form = {}
      this.dialogVisible = true
    },
    async save() {
      if (this.form.id) {
        await updateApi(this.form)
      } else {
        await addApi(this.form)
      }
      this.dialogVisible = false
      this.query()
    },
    async edit(row) {
      this.form = await queryInfoApi(row.id)
      this.dialogVisible = true
    },
    confirmDelete(id) {
      this.$confirm('确定要删除该课程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户点击确定后执行删除操作
        this.del(id);
      }).catch(() => {
        // 用户点击取消后的处理
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async del(id) {
      await deleteApi(id)
      this.query()
    }
  }
}
</script>