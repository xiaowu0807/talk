(async function () {
  // 验证是否有登录，如果没有登录，跳转到登录页，如果有登录，获取到登录的用户信息
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    alert("未登录,请先登录");
    location.href = "./login.html";
    return;
  }

  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };

  //   下面的环境都是登录过后的环境
  setUserInfo();

  //   设置注销事件
  doms.close.addEventListener("click", () => {
    API.loginOut();
    location.href = "./login.html";
  });

  await loadHistory();

  doms.msgContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    sendChatMessage();
  });

  /**
   * 加载历史记录
   */
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const data of resp.data) {
      addChat(data);
    }
    scrollToBottom();
  }

  /**
   * 根据消息队列添加聊天记录
   * @param {Object} info 消息队列
   */
  function addChat(info) {
    const item = $$$("div");
    item.classList.add("chat-item");
    if (info.from) {
      item.classList.add("me");
    }
    const img = $$$("img");
    img.classList.add("chat-avatar");
    img.src = info.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";
    const content = $$$("div");
    content.classList.add("chat-content");
    content.innerText = info.content;
    const date = $$$("div");
    date.classList.add("chat-date");
    date.innerText = dateFormat(info.createdAt);
    item.appendChild(img);
    item.appendChild(content);
    item.appendChild(date);
    doms.chatContainer.appendChild(item);
  }

  /**
   * 将传入的时间戳转化成2022-04-29 14:18:16格式
   * @param {String} time 传入时间戳
   */
  function dateFormat(time) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  /**
   * 设置用户信息
   */
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  /**
   * 将滚动条滚动到底部
   */
  function scrollToBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  /**
   * 发送消息
   */
  async function sendChatMessage() {
    const message = doms.txtMsg.value.trim();
    if (!message) {
      return;
    }
    const content = {
      content: message,
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
    };
    addChat(content);
    doms.txtMsg.value = "";
    scrollToBottom();
    const reply = await API.sendChat(message);
    addChat(reply.data);
    scrollToBottom();
  }
})();
