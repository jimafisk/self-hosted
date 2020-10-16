const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const precss = require('precss')
const tailwindCSS = require('tailwindcss')
var CleanCSS = require('clean-css')

async function processStyles({ raw:css, options }) {
  let { tailwindConfig, html, includeBase, purge, includeTailwind } = options

  let finalStyles

  try {
    tailwindConfig = tailwindConfig
      ? new Function(`return ${tailwindConfig}`)()
      : {}
    tailwindConfig = {
      ...tailwindConfig,
      purge: {
        enabled: purge,
        content: [
          {
            raw: html,
            extension: 'html',
          },
        ],
      },
      plugins: [
        require('@tailwindcss/ui'),
        require('@tailwindcss/typography'),
      ],
      future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
      },
    }
  } catch (e) {
    return { error: e }
  }

  const tailwind = tailwindCSS(tailwindConfig)
  const stylesWithTailwind = `\
    ${
      includeBase
        ? `
      @tailwind base;`
        : ``
    }\
    ${
      includeTailwind
        ? `
      @tailwind components;\
      @tailwind utilities;\
    `
        : ''
    }
    
  ${css}`

  return postcss([tailwind, precss, autoprefixer])
    .process(stylesWithTailwind, { from: undefined, to: 'styles.css' })
    .then((result) => {
      if (includeTailwind) {
        var output = new CleanCSS({}).minify(result.css)
        return output.styles
      } else {
        return result.css
      }

      if (result.map) {
        console.log(result.map)
      }
    })
    .catch((e) => {
      return { error: e.reason }
    })
  
  return finalStyles
}

module.exports = processStyles
