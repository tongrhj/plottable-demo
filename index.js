'use strict'
/* global Plottable fetch */

let regionOneData = [
  { x: 1, y: 12000 },
  { x: 2, y: 15356 },
  { x: 3, y: 17834 },
  { x: 4, y: 12980 },
  { x: 5, y: 24567 },
  { x: 6, y: 12000 },
  { x: 7, y: 15356 },
  { x: 8, y: 15888 },
  { x: 9, y: 17834 },
  { x: 10, y: 19890 },
  { x: 11, y: 21789 },
  { x: 12, y: 22789 }]

let regionTwoData = [
    { x: 1, y: 890 },
    { x: 2, y: 367 },
    { x: 3, y: 789 },
    { x: 4, y: 567 },
    { x: 5, y: 364 },
    { x: 6, y: 867 },
    { x: 7, y: 187 },
    { x: 8, y: 890 },
    { x: 9, y: 108 },
    { x: 10, y: 897 },
    { x: 11, y: 798 },
    { x: 12, y: 245 }]

// let regionThreeData = [
//     { x: 1, y: 1234 },
//     { x: 2, y: 5672 },
//     { x: 3, y: 3456 },
//     { x: 4, y: 6543 },
//     { x: 5, y: 6753 },
//     { x: 6, y: 6573 },
//     { x: 7, y: 2534 },
//     { x: 8, y: 2672 },
//     { x: 9, y: 1753 },
//     { x: 10, y: 3752 },
//     { x: 11, y: 2863 },
//     { x: 12, y: 8162 }]

function makeStackedChart () {
  const xScale = new Plottable.Scales.Linear()
  const yScale = new Plottable.Scales.Linear()
  const colourScale = new Plottable.Scales.Color()
  colourScale.range(['#4F9392', '#313131', '#c7dfdf'])

  const xAxis = new Plottable.Axes.Numeric(xScale, 'bottom')
  const yAxis = new Plottable.Axes.Numeric(yScale, 'left')

  // const xMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const yLabel = new Plottable.Components.AxisLabel('Sales', -90)
  const xLabel = new Plottable.Components.AxisLabel('2015 Months', 0)

  const plot = new Plottable.Plots.StackedBar()
    .addDataset(new Plottable.Dataset(regionOneData).metadata(1))
    .addDataset(new Plottable.Dataset(regionTwoData).metadata(2))
    .x((d) => { return d.x }, xScale)
    .y((d) => { return d.y }, yScale)
    .attr('fill', (d, i, dataset) => { return dataset.metadata() }, colourScale)

  fetch('json/regionthree.json')
    .then((res) => { return res.json() })
    .then((res) => { plot.addDataset(new Plottable.Dataset(res).metadata(3)) })

  const chart = new Plottable.Components.Table([
    [yLabel, yAxis, plot],
    [null, null, xAxis],
    [null, null, xLabel]
  ])
  chart.renderTo('svg#stacked-chart')

  window.addEventListener('resize', () => {
    plot.redraw()
  })
}

function makeTripleChart () {
  const xScale = new Plottable.Scales.Linear()
  const xAxis = new Plottable.Axes.Numeric(xScale, 'bottom')

  const r1_yScale = new Plottable.Scales.Linear()
}

makeStackedChart()
