import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ERROR from '../../../../lib/error'

export const POST = async request => {
  try {
    const { username, password } = await request.json()
    if (!username || !password) return ERROR.INVALID_FIELDS()

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return ERROR.INVALID_FIELDS()
    if (!user.active) return ERROR.USER_INACTIVE()
      
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return ERROR.INVALID_FIELDS()

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)

    return NextResponse.json(token, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}