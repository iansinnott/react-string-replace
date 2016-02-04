import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import reactReplaceString from 'react-string-replace';

const HighlightNumbers = React.createClass({
  propTypes: {
    content: PropTypes.string.isRequired,
  },

  render() {
    return (
      <div>
        <h1>Highlight Numbers</h1>
        {reactReplaceString(this.props.content, /(\d+)/g, (match, i) => (
          <span key={i} style={{ color: 'red' }}>{match}</span>
        ))}
      </div>
    );
  },
});

const content = 'Hey my number is 555-555-5555.';

// Render the app
render(<HighlightNumbers content={content} />, document.getElementById('root'));
