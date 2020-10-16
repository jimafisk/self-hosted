const fs = require('fs').promises
const { join } = require('path');
const {find,flatMapDeep,merge} = require('lodash')
const {renderPage} = require('./render')
const {flatten} = require('lodash')

async function buildSite(site) {


  const allPages = await Promise.all(
    site.pages.map(async page => {
      const { content, id } = page
      const HTML = renderPage(page, site)
      const tailwind = combineTailwindConfigs(page.styles.tailwind, site.styles.tailwind)
      const combinedCSS = site.styles.raw + page.styles.raw
      const CSS = await buildPageCSS(content, HTML, combinedCSS, tailwind)
      return [
        { name: `${id}.html`, content: HTML },
        { name: `${id}.css`, content: CSS }
      ]
    })
  )

  return [
    ...flatten(allPages),
    { name: 'style.css', content: site.styles.final }
  ]

}


async function writeFile(name, contents) {
  await fs.writeFile(`${__dirname}/../build/${name}`, contents, function (err) {
    if (err) return console.log(err);
    console.log('Hello World > helloworld.txt');
  });
}

const processStyles = require('./postcss')
async function buildPageCSS(content, HTML, rawCSS, tailwindConfig) {

  const components = flatMapDeep(content, (section) => section.columns.map(column => column.rows.filter(row => row.type === 'component')))
  const componentStyles = components.map(component => `#component-${component.id} {${component.value.raw.css}}`).join('\n')

  const css = rawCSS + componentStyles

  const pageStyles = await processStyles({
    css,
    html: HTML,
    options: { 
      includeBase: true,
      includeTailwind: true,
      purge: true,
      tailwindConfig
    }
  })

  return pageStyles

}

function combineTailwindConfigs(pageTailwind, siteTailwind) {
  try {
    const siteTailwindObject = new Function(`return ${siteTailwind}`)() // convert string object to literal object
    const pageTailwindObject = new Function(`return ${pageTailwind}`)()
    const combinedObject = merge(siteTailwindObject, pageTailwindObject)
    return JSON.stringify(combinedObject)
  } catch(e) {
    console.error(e)
    return '{}'
  }
}

module.exports = {
  buildSite,
  combineTailwindConfigs,
  buildPageCSS
}