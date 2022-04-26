<template>
  <div>
    <Dialog
      :title="this.$t('common.AttributeRule')"
      top="2vh"
      width="640px"
      :show-cancel="false"
      v-bind="$attrs"
      :visible.sync="iVisible"
      @confirm="handleConfirm"
    >
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-width="formLabelWidth"
      >
        <el-form-item
          v-for="(val, key) in attrs"
          :key="key"
          :label="val.label"
          label-position="left"
          :prop="key"
        >
          <el-select v-if="val.type === 'nested object'" v-model="form[key]">
            <el-option
              v-for="(i) in val.choices"
              :key="i.value"
              :label="i.display_name"
              :value="i.value"
            />
          </el-select>
          <el-radio-group v-if="val.type === 'choice'" v-model="form[key]">
            <el-radio
              v-for="(i) in val.choices"
              :key="i.value"
              :label="i.display_name"
            >
              {{ i.value }}
            </el-radio>
          </el-radio-group>
          <el-switch v-if="val.type ==='switch'" v-model="form[key]" />
          <el-input v-if="val.type ==='list'" v-model.trim="form[key]" />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import Dialog from '@/components/Dialog'
import { RequiredChange } from '../../../DataForm/rules'

export default {
  components: { Dialog },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    attrs: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {},
      formLabelWidth: '90px',
      rules: {
        attr: [RequiredChange],
        operator: [RequiredChange],
        value: [RequiredChange]
      }
    }
  },
  computed: {
    iVisible: {
      set(val) {
        this.$emit('update:visible', val)
      },
      get() {
        return this.visible
      }
    }
  },
  create() {
    this.resetForm()
  },
  methods: {
    resetForm() {
      for (const i in this.attrs) {
        this.form[i] = ''
      }
    },
    handleConfirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const currentForm = _.cloneDeep(this.form)
          this.$emit('addItem', currentForm)
          this.$emit('update:visible', false)
          this.$nextTick(() => {
            this.$refs['ruleForm']?.resetFields()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
