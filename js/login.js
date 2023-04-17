const login = new FieldValidator("txtLoginId", function (val) {
  if (!val) {
    return "账号不能为空";
  }
});

const pwd = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "密码不能为空";
  }
});

const form = $(".user-form");
form.onsubmit = async (e) => {
  e.preventDefault();
  const resp = await FieldValidator.validate(login, pwd);
  if (!resp) {
    return;
  }
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const result = await API.login(data);
  if (result.code === 0) {
    alert("登录成功，点击确定，跳转到首页");
    location.href = "../静态页面/index.html";
  } else {
    login.p.innerText = "账号或密码错误";
    pwd.input.value = "";
  }
};
