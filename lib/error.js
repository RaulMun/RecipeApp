import { NextResponse } from 'next/server'

const ERROR = {
  INVALID_FIELDS: (message = 'Invalid fields') => {
    return NextResponse.json({ error: message }, { status: 400 })
  },

  USER_INACTIVE: (message = 'User inactive') => {
    return NextResponse.json({ error: message }, { status: 403 })
  },

  NOT_FOUND: (message = 'Not found') => {
    return NextResponse.json({ error: message }, { status: 404 })
  },

  SERVER_ERROR: (message = 'Server error') => {
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export default ERROR

