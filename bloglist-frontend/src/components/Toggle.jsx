import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Toggle = forwardRef((props,refs) => {
  const [show,setShow] = useState(false)

  useImperativeHandle(refs,() => {return { setShow }})

  return (
    <div>
      { show && props.children}
      <button data-testid={ props.dataTestId ? props.dataTestId : null} className="row" onClick={() => setShow(!show)}>
        {show ? props.hideText : props.showText}
      </button>
    </div>
  )
})

Toggle.displayName = 'Toggle'

Toggle.propTypes = {
  showText: PropTypes.string.isRequired,
  hideText: PropTypes.string.isRequired
}


export default Toggle