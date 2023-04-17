const login = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "账号不能为空";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return "该账号已存在";
  }
});
const nickName = new FieldValidator("txtNickname", function (val) {
  if (!val) {
    return "昵称不能为空";
  }
});
const pwd = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "密码不能为空";
  }
});
const pwdAgain = new FieldValidator("txtLoginPwdConfirm", function (val) {
  if (!val) {
    return "再次输入密码不能为空";
  }
  if (val !== pwd.input.value) {
    return "两次密码不一致";
  }
});

const form = $(".user-form");
form.onsubmit = async (e) => {
  e.preventDefault();
  const resp = await FieldValidator.validate(login, nickName, pwd, pwdAgain);
  if (!resp) {
    return;
  }
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const result = await API.reg(data);
  if (result.code === 0) {
    alert("注册成功，点击确定，跳转到登录页面");
    location.href = "/talk/login.html";
  }
};
