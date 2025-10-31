<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="学生">
        <el-select clearable filterable v-model="queryForm.studentId" placeholder="请选择学生">
          <el-option v-for="student in studentList" :key="student.id" :label="student.name" :value="student.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程">
        <el-select clearable filterable v-model="queryForm.courseId" placeholder="请选择课程">
          <el-option v-for="course in courseList" :key="course.id" :label="course.name" :value="course.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="success" @click="add">新增成绩</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="studentName" label="学生姓名"></el-table-column>
      <el-table-column prop="courseName" label="课程名称"></el-table-column>
      <el-table-column prop="score" label="成绩"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="confirmDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog @before-close="closeDiaglog" v-model="dialogVisible" title="成绩信息">
      <el-form :model="form">
        <el-form-item label="学生">
          <!-- 替换为下拉框 -->
          <el-select clearable filterable v-model="form.studentId" placeholder="请选择学生">
            <el-option v-for="student in studentList" :key="student.id" :label="student.name" :value="student.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="课程">
          <el-select clearable filterable v-model="form.courseId" placeholder="请选择课程">
            <el-option v-for="course in courseList" :key="course.id" :label="course.name" :value="course.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="成绩">
          <el-input v-model="form.score"></el-input>
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
import { searchScoresApi, queryPageApi, addApi, queryInfoApi, updateApi, deleteApi } from '@/api/score'
import { getStudentListApi } from '@/api/stu'
import { selectAll } from '@/api/course'
export default {
  data() {
    return {
      queryForm: {
        studentId: '',
        courseId: ''
      },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      form: {},
      studentList: [],
      courseList: [],
    }
  },
  created() {
    this.query()
    this.getStudentList();
    this.getCourseList();
  },
  methods: {
    closeDiaglog(){
      console.log("close")
      this.form.id = '';
      this.dialogVisible = false;
    },
    async getCourseList() {
      const res = await selectAll();
      if (res) {
        this.courseList = res; // 假设返回的数据结构中有 data 字段包含学生列表
      } else {
        console.error('Invalid response format:', res);
        this.studentList = [];
      }
    },
    async getStudentList() {
      try {
        const res = await getStudentListApi();
        if (res) {
          this.studentList = res.data; // 假设返回的数据结构中有 data 字段包含学生列表
        } else {
          console.error('Invalid response format:', res);
          this.studentList = [];
        }
      } catch (error) {
        console.error('Request failed:', error);
        this.studentList = [];
      }
    },
    async query() {
      try {
        let res = await queryPageApi(this.currentPage, this.pageSize, this.queryForm.studentId, this.queryForm.courseId)
        if (res) {
          this.tableData = res.records
          this.total = res.total
        } else {
          console.error('Invalid response format:', res)
          this.tableData = []
          this.total = 0
        }
      } catch (error) {
        console.error('Request failed:', error)
        this.tableData = []
        this.total = 0
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
      try {
        if (this.form.id) {
          await updateApi(this.form);
        } else {
          await addApi(this.form);
        }
        this.$message.success('保存成功');
        this.dialogVisible = false;
        this.form.id = '';
        this.query();
      } catch (error) {
        console.error('Failed to save score:', error);
        this.$message.error('保存失败');
      }
    },
    async edit(row) {
      try {
        this.form = await queryInfoApi(row.id);
        // 确保 form 中有 studentName 和 courseName 字段
        this.dialogVisible = true;
      } catch (error) {
        console.error('Failed to get score detail:', error);
      }
    },
    confirmDelete(id) {
      this.$confirm('确定要删除该成绩吗？', '提示', {
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