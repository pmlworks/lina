const loginAssetAcl = require('./login-asset-acl-options.json')

export default [
  // user login
  {
    url: '/api/v1/acls/login-asset-acls/',
    type: 'options',
    response: config => {
      console.log('Acls: ', loginAssetAcl)
      return loginAssetAcl
    }
  }
]
