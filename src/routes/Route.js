import React, { useContext } from 'react'
import PrivateRoutes from './public/PublicRoutes'
import PublicRoutes from './private/PrivateRoutes'
import { ContextAuth } from '../context/AuthProvider'

export default function Routes() {
  const { user } = useContext(ContextAuth)
  return !user ?  <PrivateRoutes /> : <PublicRoutes /> 
}
