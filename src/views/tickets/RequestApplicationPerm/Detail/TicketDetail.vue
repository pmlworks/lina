<template>
  <GenericTicketDetail
    :object="object"
    :detail-card-items="detailCardItems"
    :special-card-items="specialCardItems"
    :one-approved-card-items="oneApprovedCardItems"
    :two-approved-card-items="twoApprovedCardItems"
    :approve="handleApprove"
    :close="handleClose"
    :reject="handleReject"
  >
    <IBox v-if="hasActionPerm&&object.status !== 'closed'" class="box">
      <div slot="header" class="clearfix ibox-title">
        <i class="fa fa-edit" /> {{ $t('common.Actions') }}
      </div>
      <template>
        <el-form ref="requestForm" :model="requestForm" label-width="140px" label-position="left" class="assets">
          <el-form-item :label="$t('assets.Applications')" :rules="requestForm.isRequired">
            <Select2 v-model="requestForm.applications" v-bind="appsSelect2" style="width: 50% !important" />
          </el-form-item>
          <el-form-item :label="$t('tickets.SystemUser')" :rules="requestForm.isRequired">
            <Select2 v-model="requestForm.systemusers" v-bind="systemuserSelect2" style="width: 50% !important" />
          </el-form-item>
          <el-form-item :label="$t('common.dateStart')" required>
            <el-date-picker
              v-model="requestForm.apply_date_start"
              type="datetime"
            />
          </el-form-item>
          <el-form-item :label="$t('common.dateExpired')" required>
            <el-date-picker
              v-model="requestForm.apply_date_expired"
              type="datetime"
            />
          </el-form-item>
        </el-form>
      </template>
    </IBox>
  </GenericTicketDetail>
</template>

<script>
import { formatTime, getDateTimeStamp } from '@/utils/index'
import { toSafeLocalDateStr } from '@/utils/common'
import { STATUS_MAP } from '../../const'
import Select2 from '@/components/FormFields/Select2'
import IBox from '@/components/IBox'
import GenericTicketDetail from '@/views/tickets/components/GenericTicketDetail'
export default {
  name: '',
  components: { GenericTicketDetail, IBox, Select2 },
  props: {
    object: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      statusMap: this.object.status === 'open' ? STATUS_MAP['notified'] : STATUS_MAP[this.object.state],
      requestForm: {
        isRequired: this.object.approval_step === this.object.process_map.length ? [{ required: true }] : [{ required: false }],
        applications: this.object.current_meta.apply_applications,
        systemusers: this.object.current_meta.apply_system_users,
        apply_date_expired: this.object.current_meta.apply_date_expired,
        apply_date_start: this.object.current_meta.apply_date_start
      },
      comments: '',
      appsSelect2: {
        multiple: true,
        value: this.object.current_meta['apply_applications'],
        ajax: {
          url: function() {
            const oid = this.object.org_id === '' ? 'DEFAULT' : this.object.org_id
            return `/api/v1/applications/applications/?oid=${oid}&type=${this.object.meta.apply_type}`
          }.bind(this)(),
          transformOption: (item) => {
            return { label: item.name, value: item.id }
          }
        }
      },
      systemuserSelect2: {
        multiple: true,
        value: this.object.current_meta['apply_system_users'],
        ajax: {
          url: function() {
            const oid = this.object.org_id === '' ? 'DEFAULT' : this.object.org_id
            const protocol = this.object.meta.apply_category === 'remote_app' ? 'rdp' : this.object.meta.apply_type
            return `/api/v1/assets/system-users/?oid=${oid}&protocol=${protocol}`
          }.bind(this)(),
          transformOption: (item) => {
            const username = item.username || '*'
            return { label: item.name + '(' + username + ')', value: item.id }
          }
        }
      }
    }
  },
  computed: {
    detailCardItems() {
      const obj = this.object || {}
      return [
        {
          key: this.$t('common.Number'),
          value: obj.serial_num
        },
        {
          key: this.$t('tickets.status'),
          value: obj.status,
          formatter: (item, val) => {
            return <el-tag type={this.statusMap.type} size='mini'> { this.statusMap.title }</el-tag>
          }
        },
        {
          key: this.$t('tickets.type'),
          value: obj.type_display
        },
        {
          key: this.$t('tickets.user'),
          value: obj['applicant_display']
        },
        {
          key: this.$t('tickets.OrgName'),
          value: obj['org_name']
        },
        {
          key: this.$t('common.dateCreated'),
          value: toSafeLocalDateStr(obj.date_created)
        },
        {
          key: this.$t('common.Comment'),
          value: obj.comment
        }
      ]
    },
    specialCardItems() {
      const meta = this.object.meta || {}
      return [
        {
          key: this.$t('applications.appType'),
          value: `${meta['apply_category_display']} / ${meta['apply_type_display']} `
        },
        {
          key: this.$t('applications.appName'),
          value: meta?.apply_applications_display?.join(', ') || ''
        },
        {
          key: this.$t('tickets.SystemUser'),
          value: meta?.apply_system_users_display?.join(', ') || ''
        },
        {
          key: this.$t('common.dateStart'),
          value: toSafeLocalDateStr(meta.apply_date_start)
        },
        {
          key: this.$t('common.dateExpired'),
          value: toSafeLocalDateStr(meta.apply_date_expired)
        }
      ]
    },
    oneApprovedCardItems() {
      const vm = this
      const meta = this.object.process_map[0] || {}
      return [
        {
          key: this.$t('tickets.PermissionName'),
          value: meta.apply_permission_name,
          formatter: function(item, value) {
            const to = { name: 'ApplicationPermissionDetail', params: { id: vm.object.id }, query: { oid: vm.object.org_id }}
            if (vm.object.status === 'closed' && vm.object.state === 'approved' && vm.object.process_map.length === 1) {
              return <router-link to={to}>{ value }</router-link>
            } else {
              return <span>{ value }</span>
            }
          }
        },
        {
          key: this.$t('applications.appName'),
          value: meta?.apply_applications_display?.join(', ') || ''
        },
        {
          key: this.$t('tickets.SystemUser'),
          value: meta?.apply_system_users_display?.join(', ') || ''
        },
        {
          key: this.$t('common.dateStart'),
          value: toSafeLocalDateStr(meta?.apply_date_start)
        },
        {
          key: this.$t('common.dateExpired'),
          value: toSafeLocalDateStr(meta?.apply_date_expired)
        }
      ]
    },
    twoApprovedCardItems() {
      const vm = this
      const meta = this.object.process_map[1] || {}
      return [
        {
          key: this.$t('tickets.PermissionName'),
          value: meta.apply_permission_name,
          formatter: function(item, value) {
            const to = { name: 'ApplicationPermissionDetail', params: { id: vm.object.id }, query: { oid: vm.object.org_id }}
            if (vm.object.status === 'closed' && vm.object.state === 'approved' && vm.object.process_map.length === 2) {
              return <router-link to={to}>{ value }</router-link>
            } else {
              return <span>{ value }</span>
            }
          }
        },
        {
          key: this.$t('applications.appName'),
          value: meta?.apply_applications_display?.join(', ') || ''
        },
        {
          key: this.$t('tickets.SystemUser'),
          value: meta?.apply_system_users_display?.join(', ') || ''
        },
        {
          key: this.$t('common.dateStart'),
          value: toSafeLocalDateStr(meta?.apply_date_start)
        },
        {
          key: this.$t('common.dateExpired'),
          value: toSafeLocalDateStr(meta?.apply_date_expired)
        }
      ]
    },
    hasActionPerm() {
      return this.object.process_map[this.object.approval_step - 1].assignees.indexOf(this.$store.state.users.profile.id) !== -1
    }
  },
  methods: {
    formatTime(dateStr) {
      return formatTime(getDateTimeStamp(dateStr))
    },
    toSafeLocalDateStr(dataStr) {
      return toSafeLocalDateStr(dataStr)
    },
    reloadPage() {
      window.location.reload()
    },
    handleApprove() {
      this.$axios.put(`/api/v1/tickets/tickets/${this.object.id}/approve/`, {
        meta: {
          apply_category: this.object.current_meta.apply_category,
          apply_type: this.object.current_meta.apply_type,
          apply_system_users: this.requestForm.systemusers ? this.requestForm.systemusers : [],
          apply_applications: this.requestForm.applications ? this.requestForm.applications : [],
          apply_date_start: this.requestForm.apply_date_start,
          apply_date_expired: this.requestForm.apply_date_expired
        }
      }).then(
        () => {
          this.$message.success(this.$tc('common.updateSuccessMsg'))
          this.reloadPage()
        }
      ).catch(
        () => this.$message.success(this.$tc('common.updateErrorMsg'))
      )
    },
    handleClose() {
      const url = `/api/v1/tickets/tickets/${this.object.id}/close/`
      this.$axios.put(url).then(res => this.reloadPage()).catch(err => this.$message.error(err))
    },
    handleReject() {
      const url = `/api/v1/tickets/tickets/${this.object.id}/reject/`
      this.$axios.put(url).then(res => this.reloadPage()).catch(err => this.$message.error(err))
    }
  }
}
</script>

<style scoped>
  .assets{
    margin-top: 14px;
  }
  .feed-activity-list .feed-element {
    border-bottom: 1px solid #e7eaec;
  }
  .feed-element > .pull-left {
    margin-right: 10px;
  }
  .feed-element .header-avatar {
    width: 38px;
    height: 38px;
  }
  .box {
    margin-bottom: 15px;
  }
</style>
