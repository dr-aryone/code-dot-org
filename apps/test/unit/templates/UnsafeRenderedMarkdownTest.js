import React from 'react';
import {shallow} from 'enzyme';
import {expect} from '../../util/configuredChai';
import UnsafeRenderedMarkdown from '@cdo/apps/templates/UnsafeRenderedMarkdown';

describe('UnsafeRenderedMarkdown', () => {
  it('will render basic markdown', () => {
    const wrapper = shallow(
      <UnsafeRenderedMarkdown markdown="**some** _basic_ [inline](markdown)" />
    );

    expect(
      wrapper.equals(
        <div>
          <p>
            <strong>some</strong> <em>basic</em> <a href="markdown">inline</a>
          </p>
        </div>
      )
    ).to.equal(true);
  });

  it('will render raw html', () => {
    const basicWrapper = shallow(
      <UnsafeRenderedMarkdown markdown='<strong>some</strong> <em>basic</em> <a href="markdown">inline</a>' />
    );

    expect(
      basicWrapper.equals(
        <div>
          <p>
            <strong>some</strong> <em>basic</em> <a href="markdown">inline</a>
          </p>
        </div>
      ),
      'inline html is rendered directly'
    ).to.equal(true);

    const advancedWrapper = shallow(
      <UnsafeRenderedMarkdown markdown="<table><thead><th>Some advanced html</th><th><strong>not</strong> usually supported by markdown</th></thead></table>" />
    );

    // note the output has added <tr> tags as appropriate
    expect(
      advancedWrapper.equals(
        <div>
          <table>
            <thead>
              <tr>
                <th>Some advanced html</th>
                <th>
                  <strong>not</strong> usually supported by markdown
                </th>
              </tr>
            </thead>
          </table>
        </div>
      ),
      'inline html including non-markdown-supported constructs is rendered directly'
    ).to.equal(true);
  });

  it('implements expandableImages', () => {
    const regularImage = shallow(
      <UnsafeRenderedMarkdown markdown="![regular](http://example.com/img.jpg)" />
    );

    expect(
      regularImage.equals(
        <div>
          <p>
            <img src="http://example.com/img.jpg" alt="regular" />
          </p>
        </div>
      ),
      'regular images are rendered normally'
    ).to.equal(true);

    const expandableImage = shallow(
      <UnsafeRenderedMarkdown markdown="![expandable](http://example.com/img.jpg)" />
    );

    // Enzyme doesn't like the data-url property when comparing equality
    // directly, so we use .html() as a proxy for this test
    expect(
      expandableImage.html(),
      'expandable images are rendered as custom spans'
    ).to.equal(
      shallow(
        <div>
          <p>
            <span
              data-url="http://example.com/img.jpg"
              className="expandable-image"
            />
          </p>
        </div>
      ).html()
    );
  });

  it('renders XML as top level block when appropriate', () => {
    const inlineXml = shallow(
      <UnsafeRenderedMarkdown markdown="Text with <xml><block type='xml'></block></xml> inline" />
    );

    expect(
      inlineXml.equals(
        <div>
          <p>
            Text with{' '}
            <xml>
              <block type="xml" />
            </xml>{' '}
            inline
          </p>
        </div>
      ),
      'inline xml blocks render within their containing paragraph'
    ).to.equal(true);

    // Need to use markdown={} rather than markdown="" here so React doesn't
    // escape the newlines
    const blockXml = shallow(
      <UnsafeRenderedMarkdown
        markdown={
          "Text with\n\n<xml><block type='xml'></block></xml>\n\nin its own block"
        }
      />
    );

    // Enzyme is particular about newlines when comparing raw elements, so we
    // still have to rely on rendered HTML comparison here
    expect(
      blockXml.html(),
      'block xml blocks render as top-level elements (siblings to paragraphs)'
    ).to.equal(
      '<div><p>Text with</p>\n<xml><block type="xml"></block></xml>\n<p>in its own block</p></div>'
    );
  });

  it('renders links normally by default', () => {
    const externalLink = shallow(
      <UnsafeRenderedMarkdown markdown="[external link](example.com)" />
    );
    expect(
      externalLink.equals(
        <div>
          <p>
            <a href="example.com">external link</a>
          </p>
        </div>
      )
    ).to.equal(true);

    const internalLink = shallow(
      <UnsafeRenderedMarkdown markdown="[internal link](code.org)" />
    );
    expect(
      internalLink.equals(
        <div>
          <p>
            <a href="code.org">internal link</a>
          </p>
        </div>
      )
    ).to.equal(true);
  });

  it('will open links in a new tab if specified', () => {
    const externalLink = shallow(
      <UnsafeRenderedMarkdown
        openExternalLinksInNewTab
        markdown="[external link](example.com)"
      />
    );
    expect(
      externalLink.equals(
        <div>
          <p>
            <a href="example.com" target="_blank" rel="noreferrer noopener">
              external link
            </a>
          </p>
        </div>
      )
    ).to.equal(true);

    const internalLink = shallow(
      <UnsafeRenderedMarkdown
        openExternalLinksInNewTab
        markdown="[internal link](code.org)"
      />
    );
    expect(
      internalLink.equals(
        <div>
          <p>
            <a href="code.org" target="_blank" rel="noreferrer noopener">
              internal link
            </a>
          </p>
        </div>
      )
    ).to.equal(true);
  });

  it('is resistant to JS injection', () => {
    const scriptTagInjection = shallow(
      <UnsafeRenderedMarkdown markdown='<script type="text/javascript">alert(&#x22;hello!&#x22;)</script>' />
    );
    expect(
      scriptTagInjection.equals(<div />),
      'script tags are ignored'
    ).to.equal(true);

    const inlineEventInjection = shallow(
      <UnsafeRenderedMarkdown markdown='<div onMouseOver="alert("hello!")"></div>' />
    );
    expect(
      inlineEventInjection.equals(<div />),
      'event attributes are ignored'
    ).to.equal(true);

    const iframeInjection = shallow(
      <UnsafeRenderedMarkdown
        markdown={`<iframe src="javascript:alert('hello')"></iframe>`}
      />
    );
    expect(iframeInjection.equals(<div />), 'iframes are ignored').to.equal(
      true
    );

    const miscInjection = shallow(
      <UnsafeRenderedMarkdown markdown='<div><math><mi xlink:href="data:x,<script>alert(&#x22;foxtrot&#x22;)</script>"></mi></math></div>' />
    );
    expect(
      miscInjection.equals(<div>{'">'}</div>),
      'arbitrary unsupported tags are ignored and/or escaped'
    ).to.equal(true);
  });
});
