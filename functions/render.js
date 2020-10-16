const prettier = require("prettier");

function renderPage(page, site) {
  const HTML = `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" type="text/css" href="./styles.css" />
      <link rel="stylesheet" type="text/css" href="./${page.id}.css" />
      <script src="./${page.id}.js"></script>
      ${
        page.dependencies.libraries.length > 0 
        ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.3.1/system.min.js" integrity="sha256-15j2fw0zp8UuYXmubFHW7ScK/xr5NhxkxmJcp7T3Lrc=" crossorigin="anonymous"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.3.2/extras/use-default.min.js" integrity="sha256-uVDULWwA/sIHxnO31dK8ThAuK46MrPmrVn+JXlMXc5A=" crossorigin="anonymous"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.3.2/extras/amd.min.js" integrity="sha256-7vS4pPsg7zx1oTAJ1zQIr2lDg/q8anzUCcz6nxuaKhU=" crossorigin="anonymous"></script>
          <script type="systemjs-importmap">${JSON.stringify({"imports": _.mapValues(_.keyBy(page.dependencies.libraries.filter(l => l.src.slice(-5).includes('.js')), 'name'), 'src')})}</script>`
        : ``
      }
      `+
      `${site.wrapper.head.final}
       ${page.wrapper.head.final}
    </head>

    <body data-instant-intensity="all" class="primo-page">   
      ${buildPageHTML(page, site)}
      ${site.wrapper.below.final}
      ${page.wrapper.below.final}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/instant.page/5.1.0/instantpage.js" integrity="sha256-DdSiNPR71ROAVMqT6NiHagLAtZv9EHeByYuVxygZM5g=" crossorigin="anonymous"></script>
    </body>
    </html>
  `

  return HTML
  return prettier.format(HTML, { parser: 'html' })

  function buildPageHTML(page, site) {
    const { content } = page 
    let html = ''
    content.forEach(section => {
      html += `<div id="section-${section.id}">\n` +
                `<div class="columns flex flex-wrap ${section.width === 'contained' ? 'container' : ''}">\n`
      section.columns.forEach(column => {
        html += `<div class="column ${column.size}" id="column-${column.id}">\n`
        column.rows.forEach(row => {
          html += row.type === 'component' 
                  ? `<div class="primo-component">\n` +
                      `<div id="component-${row.id}" class="w-full">${row.value.final.html}</div>\n` +
                      `<script>${row.value.final.js}</script>\n` + 
                    `</div>\n`
                  : `<div class="primo-content">\n` +
                      `${row.value.html}\n` + 
                    `</div>\n`
        })
        html += `</div>\n`
      })
      html += `</div>\n` +
            `</div>\n`
    })

    var regex = /href=(['"])\/([\S]+)(\1)[^>\s]*/g;
    html = html.replace(regex, "href='/$2.html'")

    return html
  }
}

function renderCSS(page) {
  return page.styles.final
}

module.exports = { renderPage, renderCSS }