const _ = require('lodash')
const job = require('./javascript_advert')
const m = require('mithril')
const d3 = require('d3')

const app = {};

app.controller = function() {

  const headline = job.headline; delete job.headline;

  function draw(el, isInit, context) {

    const svg = d3.select(el)
    const rand = d3.random.normal(70, 40);

    // Create vertices
    const vertices = d3.range(100).map(() => [rand(), rand()])

    // Create Voroni
    const voronoi = d3.geom.voronoi()
      .clipExtent([['10%', '10%'],['90%', '90%']])

    const lines = svg.append('svg:g')
      .attr('id', 'lines')
      .selectAll('path')
      .data(voronoi.triangles(vertices))
      .enter().append('path')
      .attr('d', d => 'M'+d.join('L') + 'Z')
  }

  function checkBasic(basic) {
    if(_.isBoolean(basic)) return m('p.bool', basic);
    if(_.isString(basic)) return m('p.str', basic);
    if(_.isNumber(basic)) return m('p.num', basic);
    return false;
  }

  function checkAll(item) {
    const res = checkBasic(item); if(res) return res;
    if(_.isArray(item)) {
      return m('ul.arr', item.map(it => m('li', checkBasic(it))))
    }
    if(_.isObject(item)) {
      return m('ul.map', _.map(item, (val, key) => {
        if(_.isObject(val)) return m('li.list', [m('h5', key), checkAll(val)])
        return m('li', [m('h5', key), checkAll(val)])
      }))
    }
  }
  return {checkAll, headline, job, draw}
};

app.view = function(ctrl) {
  return [
    m('header', [
      m('h1', ctrl.headline),
      m('svg#graphic', {config: ctrl.draw, width: 100, height: 100, viewBox:'50 0 100 100' }),
      m('footer', [
        // m('h2', 'Made by Jacob Payne'),
        m('img#ethcore', {src: './assets/ethcore_logo.svg'}),
        m('img#eth', {src: './assets/eth_logo.png'})
      ])
    ]),
    m('.grid', [
      _.map(ctrl.job, (list, key) => m('section.col.info', [
        m('header', m('h3', {id: key}, _.upperFirst(key))),
        ctrl.checkAll(list)
      ]))
    ])
  ]
}

m.mount(document.getElementById("app"), app)
