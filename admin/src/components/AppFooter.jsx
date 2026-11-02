import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 flex justify-content-center align-items-center">
      <span>Online Store Admin © 2026</span>
    </CFooter>
  )
}

export default React.memo(AppFooter)