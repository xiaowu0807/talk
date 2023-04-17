// 登录注册的表单项验证

/**
 * 对某一个表单项进行验证的构造方法
 */
class FieldValidator {
  /**
   *
   * @param {String} txtId 验证的表单的id
   * @param {Function} validatorFunc 验证规则函数，当需要对该文本框验证时，会调用该函数，函数的参数是文本框的值，验证失败，函数的返回结果是错误消息，若没有则说明验证成功
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.onblur = () => {
      this.validate();
    };
  }
  /**
   * 验证，成功返回true，失败返回false
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  /**
   * 对所有的验证器进行雁阵，均为true返回true，否则返回false
   * @param {FieldValidator[]} validators
   */
  static async validate(...validators) {
    const pros = validators.map((v) => v.validate());
    const results = await Promise.all(pros);
    return results.every((r) => r);
  }
}
