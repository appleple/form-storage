import serialize from 'form-serialize';
import queryString from 'query-string';

const defaults = {
  name: 'form',
  ignores: []
}

export default class FormStorage {

  constructor(selector, opt) {
    this.ele = document.querySelector(selector);
    this.opt = Object.assign({}, defaults, opt);
  }

  save() {
    const str = serialize(this.ele);
    window.localStorage.setItem(this.opt.name, str);
  }

  clear() {
    window.localStorage.removeItem(this.opt.name);
  }

  apply() {
    const str = window.localStorage.getItem(this.opt.name);
    const { ignores } = this.opt;
    if (!str) {
      return;
    }
    const obj = queryString.parse(str.replace(/^"(.*)"$/, "$1"));

    for (const key in obj) {
      let flag = false;
      const target = document.querySelector(`[name="${key}"]`);
      const targets = document.querySelectorAll(`[name="${key}"]`);

      if (!target) {
        continue;
      }

      ignores.forEach((ignore) => {
        if (target.matches(ignore)) {
          flag = true;
          return false;
        }
      });

      if (flag) {
        continue;
      }

      if (targets && targets.length > 1) {
        const arr = obj[key];
        [].forEach.call(targets, (tar, index) => {
          if (tar.type === 'checkbox') {
            arr.forEach(item => {
              if (item === tar.value) {
                tar.checked = true;
              }
            });
          } else if (tar.type === 'radio') {
            if (tar.value === arr) {
              tar.checked = true;
            }
          }
        });
        continue;
      }

      if (target.type === 'radio' || target.type === 'checkbox') {
        if (obj[key] === target.value) {
          target.checked = true;
        }
      } else {
        target.value = obj[key];
      }
    }
  }
}