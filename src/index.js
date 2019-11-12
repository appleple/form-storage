import 'element-matches-polyfill';
import serialize from 'form-serialize';
import queryString from 'query-string-es5';

const defaults = {
  name: 'form',
  ignores: [],
  includes: [],
  checkbox: null
}

export default class FormStorage {

  constructor(selector, opt) {
    this.ele = document.querySelector(selector);
    this.opt = Object.assign({}, defaults, opt);
    if (this.opt.checkbox) {
      this.checkbox = document.querySelector(this.opt.checkbox);
      this.setCheckbox();
      this.apply();
    }
  }

  save() {
    const str = serialize(this.ele);
    window.localStorage.setItem(this.opt.name, str);
  }

  clear() {
    window.localStorage.removeItem(this.opt.name);
  }

  setCheckbox() {
    this.ele.addEventListener('submit', () => {
      if (this.checkbox.checked) {
        this.save();
      } else {
        this.clear();
      }
    })
  }

  getState() {
    return serialize(this.ele);
  }

  applyState(str) {
    const { ignores, includes } = this.opt;
    const obj = queryString.parse(str.replace(/^"(.*)"$/, "$1"));
    for (const key in obj) {
      let flag = false;
      const target = this.ele.querySelector(`[name="${key}"]`);
      const targets = this.ele.querySelectorAll(`[name="${key}"]`);

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

      if (includes.length > 0) {
        flag = true;
        includes.forEach((include) => {
          if (target.matches(include)) {
            flag = false;
            return false;
          }
        });
        if (flag) {
          continue;
        }
      }

      if (targets && targets.length > 1) {
        const arr = obj[key];
        [].forEach.call(targets, (tar, index) => {
          if (tar.type === 'checkbox') {
            if (arr.forEach) {
              arr.forEach(item => {
                if (item === tar.value) {
                  tar.checked = true;
                }
              });
            } else {
              if (arr === tar.value) {
                tar.checked = true;
              }
            }
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

  apply() {
    const str = window.localStorage.getItem(this.opt.name);
    if (!str) {
      return;
    }
    this.applyState(str);
  }
}
