import { useState } from 'react'

const Toggle = (props) => {
    const [show,setShow] = useState(false)
    return (
        <div>
            { show && props.children}
            <button onClick={() => setShow(!show)}>
                {show ? props.hideText : props.showText}
            </button>
        </div>
    )
}

export default Toggle