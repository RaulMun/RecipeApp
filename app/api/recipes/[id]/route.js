import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import ERROR from '../../../../lib/error'

export const GET = async (_, { params }) => {
  try {
    const { id } = await params
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    })
    if (!recipe) return ERROR.NOT_FOUND()
    return NextResponse.json(recipe, { status: 200 })
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return ERROR.SERVER_ERROR()
  }
}

export const DELETE = async (_, { params }) => {
  try {
    const { id } = await params
    await prisma.recipe.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Recipe deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return ERROR.SERVER_ERROR()
  }
}

export const PUT = async (request, { params }) => {
  try {
    const { id } = await params
    const { title, ingredients, instructions, photo } = await request.json()

    const ingredientsArray = Array.isArray(ingredients)
      ? ingredients
      : String(ingredients || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

    const stepsArray = Array.isArray(instructions)
      ? instructions
      : String(instructions || '')
          .split(/\r?\n|\.|\n/)
          .map((s) => s.trim())
          .filter(Boolean)

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        ingredients: ingredientsArray.length ? ingredientsArray : undefined,
        steps: stepsArray.length ? stepsArray : undefined,
        photo,
      },
    })
    return NextResponse.json(updatedRecipe, { status: 200 })
  } catch (error) {
    console.error('Error updating recipe:', error)
    return ERROR.SERVER_ERROR()
  }
}