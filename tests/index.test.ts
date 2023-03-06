import './setup-tests'
import React from 'react'
import { expect, test } from 'vitest'
import { bundleMDX } from 'mdx-bundler'
import { getMDXComponent } from 'mdx-bundler/client'
import { render } from '@testing-library/react'

test('Mdx bundler correctly highlights Javascript code', async () => {
  // TODO: Figure out how to import directly from src/index.ts
  const { mdxCodeFormatter } = await import('../dist/index')

  const mdxDemo = `
\`\`\`javascript filename=index.js
const a = 1;
const b = 2;
console.log("Sum is: ", a + b);

<HugeMapComponent
  enableLayerX
  geojson={geojson}
  featureStatuses={featureStatuses}
  filterFnForLayerX={filterFnForLayerX}
  dataForLayerX={dataForLayerX}
  onSelectFeature={onSelectFeature}
  isMobileSelectionEnabled={isMobileSelectionEnabled}
  onEventXForLayerX={onEventXForLayerX}
  isFeatureEnabledZ={isFeatureEnabledZ}
  isFeatureEnabledW={isFeatureEnabledW}
  mapMode={mapMode}
  onEventXForLayerZ={onEventXForLayerZ}
  anotherProp={anotherProp}
  style={style}
  {...insert10MoreProps}
/>
\`\`\`
`
  const mdx = await bundleMDX({
    source: mdxDemo,
    mdxOptions(options) {
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        mdxCodeFormatter,
      ]
      return options
    },
  })

  const Component = getMDXComponent(mdx.code)

  const { container } = render(React.createElement(Component))

  const codeBlocks = container.querySelector('pre')
  expect(codeBlocks).toBeTruthy()

  const objectDataset = { ...codeBlocks!.dataset }
  expect(objectDataset?.filename).toBe('index.js')
})
