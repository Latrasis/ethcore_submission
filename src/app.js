const _ = require('lodash')
const job = require('./javascript_advert')
const m = require('mithril')


const app = {};

app.controller = function() {

  const headline = job.headline; delete job.headline;

  function checkBasic(basic) {
    if(_.isBoolean(basic)) return m('p.bool', basic);
    if(_.isString(basic)) return m('p.str', basic);
    if(_.isNumber(basic)) return m('p.num', basic);
    return false;
  }

  function checkAll(item) {
    const res = checkBasic(item); if(res) return res;
    if(_.isArray(item)) {
      return m('ul', item.map(it => m('li', checkBasic(it))))
    }
    if(_.isObject(item)) {
      return m('ul', _.map(item, (val, key) => {
        if(_.isObject(val)) return m('li.list', [m('h5', key), checkAll(val)])
        return m('li', [m('h5', key), checkAll(val)])
      }))
    }
  }
  return {checkAll, headline, job}
};

app.view = function(ctrl) {
  return [
    m('header', m('h1', ctrl.headline)),
    m('.grid', [
      _.map(ctrl.job, (list, key) => m('section.col.info', [
        m('header', m('h3', _.upperFirst(key))),
        ctrl.checkAll(list)
      ]))
    ])
  ]
}

m.mount(document.getElementById("app"), app)
