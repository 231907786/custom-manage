import AV from 'leancloud-storage'
// 应用 ID，用来识别应用
var APP_ID = 'dWz3wrBIlGfJAvWPrI03vJmR-gzGzoHsz';

// 应用 Key，用来校验权限（Web 端可以配置安全域名来保护数据安全）
var APP_KEY = 'HAsMR0hKexry5AcndQd7iaQ6';

// 初始化
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

export default AV
