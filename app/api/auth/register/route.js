import { NextResponse } from 'next/server'
import { prisma } from '~/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ERROR from '~/lib/error'

export const POST = async request => {
  try {
    const { username, password } = await request.json()
    if (!username || !password) return ERROR.INVALID_FIELDS()
    const user = await prisma.user.findUnique({ where: { username } })
    if (user) return ERROR.INVALID_FIELDS()
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword },
    })
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET)
    return NextResponse.json(token, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}