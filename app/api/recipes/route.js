import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import ERROR from '../../../lib/error'

export async function POST(request) {
  try {
    const { title, ingredients, instructions, photo, token } = await request.json()
    if (!token) {
      return NextResponse.json({ error: 'Authentication token is required' }, { status: 401 })
    }
    let userId
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      userId = decoded.userId
    } catch (err) {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
    }
    if (!title || !ingredients || !instructions) {
      return NextResponse.json({ error: 'Title, ingredients, and instructions are required' }, { status: 400 })
    }
    // Normalize ingredients and steps to string[] as defined in Prisma schema
    const ingredientsArray = Array.isArray(ingredients)
      ? ingredients
      : String(ingredients)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

    const stepsArray = Array.isArray(instructions)
      ? instructions
      : String(instructions)
          .split(/\r?\n|\.|\n/) // allow newline, dot or explicit array
          .map((s) => s.trim())
          .filter(Boolean)

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        ingredients: ingredientsArray,
        steps: stepsArray,
        photo,
        creatorId: userId,
      },
    })
    return NextResponse.json(newRecipe, { status: 201 })
  } catch (error) {
    console.error('Error creating recipe:', error)
    return ERROR.SERVER_ERROR()
  }
}

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany()
    return NextResponse.json(recipes, { status: 200 })
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return ERROR.SERVER_ERROR()
  }
}