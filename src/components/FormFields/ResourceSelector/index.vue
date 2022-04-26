<template>
  <div>
    <el-radio-group
      v-model="currentValue.strategy"
      @change="onChange"
    >
      <el-radio
        v-for="item in strategyOptions"
        :key="item.value"
        :label="item.value"
      >
        {{ item.label }}
      </el-radio>
    </el-radio-group>
    <Select2
      v-if="isHidden('objects')"
      v-model="currentValue.objects"
      v-bind="objects"
    />
    <ResourceTable
      v-if="isHidden('attrs')"
      v-model="currentValue.attrs"
      :attrs="attrsOptions"
    />
  </div>
</template>

<script>
import Select2 from '../Select2'
import ResourceTable from './components/ResourceTable'
export default {
  components: {
    Select2,
    ResourceTable
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    strategy: {
      type: Array,
      default: () => []
    },
    objects: {
      type: Object,
      default: () => {}
    },
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
      currentValue: {
        strategy: this.value.strategy || 'all',
        objects: this.value.objects || {},
        attrs: this.value.attrs || []
      }
    }
  },
  computed: {
    isHidden() {
      return value => {
        return this.currentValue.strategy === value
      }
    },
    strategyOptions() {
      const { strategy, fieldMeta } = this
      const strategyChoices = strategy.length > 0 ? strategy : (fieldMeta.children.strategy.choices || [])
      return strategyChoices.map(item => {
        return { label: item.display_name, value: item.value }
      })
    },
    attrsOptions() {
      const { attrs, fieldMeta } = this
      const newAttrs = fieldMeta.children.attrs.children.rules.child.children || {}
      return attrs || newAttrs
    }
  },
  watch: {
    currentValue: {
      handler(val) {
        let isSpread = true
        const strategy = val.strategy
        const object = { [strategy]: this.currentValue[strategy] }
        if (strategy === 'all') isSpread = false
        this.$emit('change', {
          strategy,
          ...(isSpread && object)
        })
      },
      deep: true
    }
  },
  methods: {
    onChange(val) {
      this.currentValue.strategy = val
    }
  }
}
</script>

<style scoped>
</style>
