<template>
  <div>
    <el-radio-group v-model="currentValue.strategy" @change="onChange">
      <el-radio
        v-for="item in strategyOptions"
        :key="item.value"
        :label="item.value"
      >
        {{ item.label }}
      </el-radio>
    </el-radio-group>
    <Select2
      v-show="isHidden('objects')"
      ref="select2"
      v-model="currentValue.objects"
      v-bind="objects"
    />
    <!--    <ResourceTable-->
    <!--      v-show="isHidden('attrs')"-->
    <!--      v-model="currentValue.attrs"-->
    <!--      :attrs-option="attrs"-->
    <!--      :new-attrs="newAttrs"-->
    <!--    />-->
  </div>
</template>

<script>
import Select2 from '../Select2'
// import ResourceTable from './components/ResourceTable'
export default {
  components: {
    Select2
    // ResourceTable
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    // Custom select2 configuration
    objects: {
      type: Object,
      default: () => {}
    },
    // Custom attrs form configuration
    attrs: {
      type: Object,
      default: () => {}
    },
    fieldMeta: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      newObjects: {},
      newAttrs: {},
      currentValue: {
        strategy: this.value.strategy || 'all',
        objects: this.value.objects || {},
        attrs: this.value.attrs || []
      }
    }
  },
  computed: {
    strategyOptions() {
      return this.fieldMeta.children.strategy.choices.map(item => {
        return { label: item['display_name'], value: item.value }
      })
    },
    isHidden() {
      return value => {
        return this.currentValue.strategy === value
      }
    }
  },
  watch: {
    currentValue: {
      handler(val) {
        let strategy = val.strategy
        const obj = { [val.strategy]: this.currentValue[val.strategy] }
        if (strategy === 'all') strategy = ''
        this.$emit('change', {
          strategy: val.strategy,
          ...(strategy && obj)
        })
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
    },
    onChange(val) {
      this.currentValue.strategy = val
    }
  }
}
</script>

<style scoped>
</style>
