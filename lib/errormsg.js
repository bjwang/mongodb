/**
 * errormsg
 */
var ErrMsg = {
  // def
  def: '操作失败，稍后重试',
  // login
  login: '请输入正确的用户名和密码',
  loginCount: '登录失败次数过多,请稍后再试',
  // mobile
  isMobile: '请输入正确的手机号码',
  emptyMobile: '请输入手机号码',
  equalMobile: '手机号码不能和当前相同',
  mobileExists: '手机号码已存在',
  trialActivityMobileExists: '此活动仅限新用户参加',
  mobileNotExists: '手机号码不存在',
  isHeroRate: '请输入收益率',
  // captcha
  isCaptcha: '请输入正确的验证码',
  lenCaptcha: '请输入正确的验证码',
  expireCaptcha: '验证码过期，请重新获取',
  // smscode
  isCode: '请输入正确的手机验证码',
  emptyCode: '请输入手机验证码',
  isSmsCode: '请输入正确的手机验证码',
  quickSmsCode: '验证码发送太快',
  lenSmsCode: '请输入正确的手机验证码',
  // nickname
  isNickName: '请输入正确的昵称',
  emptyNickName: '请输入昵称,2-12个字符',
  nickNameExists: '昵称已存在',
  lenNickName: '2-12个字符',
  // password
  isPwd: '请输入密码,3-20个字符',
  emptyPwd: '请输入密码',
  emptyCurrentPwd: '请输入当前密码',
  emptyNewPwd: '请输入新密码',
  emptyRePwd: '请输入确认密码',
  lenPwd: '密码长度3-20个字符',
  rePwd: '两次输入密码不一致',
  currentPwd: '当前密码不正确',
  equalPwd: '新密码不能原密码相同',
  lenNewPwd: '新密码长度3-20个字符',
  // realname
  isRealname: '真实姓名2-6个汉字',
  emptyRealname: '请输入真实姓名',
  // Identity
  isIdentity: '身份证号码不正确',
  emptyIdentity: '请输入身份证号',
  // Trusted
  isTrusted: '请先进行实名认证',
  articleError: '暂无数据',
  productNoError: '暂无数据'
};


module.exports = ErrMsg;
