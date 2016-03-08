  /* global Plottable */

// import 'es6-promise'
// import 'whatwg-fetch'

(() => {
  'use strict'
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

  const xMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const colourScale = new Plottable.Scales.Color()
  colourScale.range(['#4F9392', '#313131', '#D9BF23'])

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
    const xScale = new Plottable.Scales.Category()
    const yScale = new Plottable.Scales.Linear()

    const xAxis = new Plottable.Axes.Category(xScale, 'bottom')
    const yAxis = new Plottable.Axes.Numeric(yScale, 'right')

    const xLabel = new Plottable.Components.AxisLabel('2015 Months', 0)
    const yLabel = new Plottable.Components.AxisLabel('Sales', 90)

    const plot = new Plottable.Plots.StackedBar()
      .addDataset(new Plottable.Dataset(regionOneData).metadata(1))
      .addDataset(new Plottable.Dataset(regionTwoData).metadata(2))
      .x((d) => { return xMonths[d.x - 1] }, xScale)
      .y((d) => { return d.y }, yScale)

    window.fetch('json/regionthree.json')
      .then((res) => { return res.json() })
      .then((res) => {
        plot.addDataset(new Plottable.Dataset(res).metadata(3))
          .attr('fill', (d, i, dataset) => { return dataset.metadata() }, colourScale)
      })

    attachInteractionTo(plot, 0.5, 1)

    const gridlines = new Plottable.Components.Gridlines(null, yScale)

    const graphGroup = new Plottable.Components.Group([gridlines, plot])

    const chart = new Plottable.Components.Table([
      [graphGroup, yAxis, yLabel],
      [xAxis, null, null],
      [xLabel, null, null]
    ])
    chart.renderTo('svg#stacked-chart')

    window.addEventListener('resize', () => {
      plot.redraw()
    })
  }

  function attachInteractionTo (plot, hoverFade, exitFade) {
    const interaction = new Plottable.Interactions.Pointer()
    const headerDisplay = document.querySelector('header h1')
    interaction.onPointerMove((point) => {
      plot.entities().forEach((entity) => {
        entity.selection.attr('opacity', hoverFade)
      })
      const closest = plot.entityNearest(point)
      if (closest) {
        closest.selection.attr('opacity', 1)
        headerDisplay.textContent = xMonths[closest.datum.x - 1] + ' Sales: ' + closest.datum.y
      }
    })
    interaction.onPointerExit(() => {
      headerDisplay.textContent = 'Regional Sales 2015'
      plot.entities().forEach((entity) => {
        entity.selection.attr('opacity', exitFade)
      })
    })
    interaction.attachTo(plot)
  }

  function makeTripleChart () {
    const yLabel = new Plottable.Components.AxisLabel('Sales', -90)
    const xLabel = new Plottable.Components.AxisLabel('2015 Months', 0)

    const xScale = new Plottable.Scales.Category()
    const xAxis = new Plottable.Axes.Category(xScale, 'bottom')

    const r1_yScale = new Plottable.Scales.Linear()
    const r1_yAxis = new Plottable.Axes.Numeric(r1_yScale, 'left')
    const r1_plot = new Plottable.Plots.Area()
      .addDataset(new Plottable.Dataset(regionOneData).metadata(1))
      .x((d) => { return xMonths[d.x - 1] }, xScale)
      .y((d) => { return d.y }, r1_yScale)
      .attr('fill', (d, i, dataset) => { return dataset.metadata() }, colourScale)
      .attr('stroke', (d, i, dataset) => { return dataset.metadata() }, colourScale)
    const r1_yLabel = new Plottable.Components.AxisLabel('Region 1', -90)

    const symbolSize = 10
    const r1_scatterPlot = new Plottable.Plots.Scatter()
      .addDataset(new Plottable.Dataset(regionOneData).metadata(1))
      .x((d) => { return xMonths[d.x - 1] }, xScale)
      .y((d) => { return d.y }, r1_yScale)
      .attr('opacity', 0)
      .attr('fill', (d, i, dataset) => { return dataset.metadata() }, colourScale)
      .size(symbolSize)

    const r2_yScale = new Plottable.Scales.Linear()
    const r2_yAxis = new Plottable.Axes.Numeric(r2_yScale, 'left')
    const r2_plot = new Plottable.Plots.Area()
      .addDataset(new Plottable.Dataset(regionTwoData).metadata(2))
      .x((d) => { return xMonths[d.x - 1] }, xScale)
      .y((d) => { return d.y }, r2_yScale)
      .attr('fill', (d, i, dataset) => { return dataset.metadata() }, colourScale)
      .attr('stroke', (d, i, dataset) => { return dataset.metadata() }, colourScale)
    const r2_yLabel = new Plottable.Components.AxisLabel('Region 2', -90)

    const r2_scatterPlot = new Plottable.Plots.Scatter()
      .addDataset(new Plottable.Dataset(regionTwoData).metadata(2))
      .x((d) => { return xMonths[d.x - 1] }, xScale)
      .y((d) => { return d.y }, r2_yScale)
      .attr('opacity', 0)
      .attr('fill', (d, i, dataset) => { return dataset.metadata() }, colourScale)
      .size(symbolSize)

    const r3_yScale = new Plottable.Scales.Linear()
    const r3_yAxis = new Plottable.Axes.Numeric(r3_yScale, 'left')
    const r3_plot = new Plottable.Plots.Area()
      .x((d) => { return xMonths[d.x - 1] }, xScale)
      .y((d) => { return d.y }, r3_yScale)
      .attr('fill', (d, i, dataset) => { return dataset.metadata() }, colourScale)
      .attr('stroke', (d, i, dataset) => { return dataset.metadata() }, colourScale)
    const r3_yLabel = new Plottable.Components.AxisLabel('Region 3', -90)

    const r3_scatterPlot = new Plottable.Plots.Scatter()
      .x((d) => { return xMonths[d.x - 1] }, xScale)
      .y((d) => { return d.y }, r3_yScale)
      .attr('opacity', 0)
      .attr('fill', (d, i, dataset) => { return dataset.metadata() }, colourScale)
      .size(symbolSize)

    window.fetch('json/regionthree.json')
      .then((res) => { return res.json() })
      .then((res) => {
        r3_plot.addDataset(new Plottable.Dataset(res).metadata(3))
        r3_scatterPlot.addDataset(new Plottable.Dataset(res).metadata(3))
      })

    const r1_graph = new Plottable.Components.Group([r1_plot, r1_scatterPlot])
    const r2_graph = new Plottable.Components.Group([r2_plot, r2_scatterPlot])
    const r3_graph = new Plottable.Components.Group([r3_plot, r3_scatterPlot])

    const chart = new Plottable.Components.Table([
      [null, r1_yLabel, r1_yAxis, r1_graph],
      [yLabel, r2_yLabel, r2_yAxis, r2_graph],
      [null, r3_yLabel, r3_yAxis, r3_graph],
      [null, null, null, xAxis],
      [null, null, null, xLabel]
    ])

    attachInteractionTo(r1_scatterPlot, 0, 0)
    attachInteractionTo(r2_scatterPlot, 0, 0)
    attachInteractionTo(r3_scatterPlot, 0, 0)

    chart.renderTo('svg#triple-chart')

    window.addEventListener('resize', () => {
      r1_plot.redraw()
      r2_plot.redraw()
      r3_plot.redraw()
    })
  }

  function makeLegend () {
    const legend = new Plottable.Components.Legend(colourScale)
    colourScale.domain(['Region 1', 'Region 2', 'Region 3'])
    legend.xAlignment('center')
    legend.yAlignment('center')
    const chart = new Plottable.Components.Table([[legend]])
    chart.renderTo('svg#chart-legend')
  }

  makeStackedChart()
  makeTripleChart()
  makeLegend()

  window.onload = () => {
    Array.from(document.querySelectorAll('svg')).forEach((elem) => {
      elem.classList.toggle('visible')
    })
  }
})()
