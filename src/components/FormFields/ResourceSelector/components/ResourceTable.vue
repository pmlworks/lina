<template>
  <div class="layout">
    <span class="create">
      <i class="el-icon-circle-plus add" @click="dialogVisible" />
    </span>
    <ResourceFormDialog
      v-if="visible"
      :attrs="attrs"
      :visible.sync="visible"
      @addItem="handleForm"
    />
    <el-table
      :data="tableDatas"
      style="width: 100%"
    >
      <div v-for="(val, key) in attrs" :key="key">
        <el-table-column
          :key="key"
          :prop="key"
          :label="val.label"
        />
      </div>
      <el-table-column :label="this.$t('common.Actions')">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, tableDatas)"
          >
            {{ $t('common.Delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ResourceFormDialog from './ResourceFormDialog'
export default {
  components: { ResourceFormDialog },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    attrs: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableDatas: this.value || [],
      visible: false
    }
  },
  computed: {
  },
  methods: {
    handleForm(item) {
      this.tableDatas.push(item)
    },
    handleDelete(index, rows) {
      rows.splice(index, 1)
      this.$emit('handleValue', rows)
    },
    dialogVisible() {
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .layout {
    position: relative;
    .create {
      position: absolute;
      top: 16px;
      left: -50px;
      z-index: 1;
    }
    .add {
      font-size: 22px;
      &:hover {
        cursor: pointer;
        opacity: .8;
      }
    }
  }
</style>
