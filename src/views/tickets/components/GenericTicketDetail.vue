<template>
  <el-row :gutter="20">
    <el-col :md="17" :sm="24">
      <Details :detail-card-items="detailCardItems" :title="$t('common.BasicInfo')" />
      <Details v-if="specialCardItems.length > 0" :detail-card-items="specialCardItems" :title="$t('common.ApplyInfo')" />
      <Details v-if="showOneApprovedCard && oneApprovedCardItems.length > 0" :detail-card-items="oneApprovedCardItems" :title="$t('tickets.AssignedInfo')+ ' 1'" />
      <Details v-if="showTwoApprovedCard && twoApprovedCardItems.length > 0" :detail-card-items="twoApprovedCardItems" :title="$t('tickets.AssignedInfo') + ' 2'" />
      <slot id="MoreDetails" />
      <Comments :object="object" v-bind="$attrs" />
    </el-col>
    <el-col :md="7" :sm="24">
      <Steps :object="object" />
      <Session v-perms="'tickets.view_ticket'" :object="object" />
    </el-col>
  </el-row>
</template>

<script>
import Details from './Details'
import Comments from './Comments'
import Steps from './Steps'
import Session from './Session'

export default {
  name: 'GenericTicketDetail',
  components: { Steps, Comments, Details, Session },
  props: {
    object: {
      type: Object,
      default: () => ({})
    },
    specialCardItems: {
      type: Array,
      default: () => ([])
    },
    detailCardItems: {
      type: Array,
      default: () => ([])
    },
    oneApprovedCardItems: {
      type: Array,
      default: () => ([])
    },
    twoApprovedCardItems: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {}
  },
  computed: {
    showOneApprovedCard() {
      const object = this.object
      return (object.state === 'approved' && object.approval_step === 1) || object.approval_step !== 1
    },
    showTwoApprovedCard() {
      const object = this.object
      return object.status === 'closed' && object.approval_step === 2 && object.state === 'approved'
    }
  }
}
</script>

<style lang='less' scoped>

</style>
