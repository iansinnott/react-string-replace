import React, { PropTypes } from 'react';
import { render } from 'react-dom';

import reactReplaceString from '../';

const Highlight = React.createClass({
  propTypes: {
    content: PropTypes.string.isRequired,
  },

  render() {
    return (
      <div>
        {reactReplaceString(this.props.content, )
          <span className='highlight'>{x}</span>
        }
      </div>
    );
  },
});


const content = `Hey my number is 555-555-5555.`;

// Render the app
render(<Highlight content={content} />, document.getElementById('root'));
