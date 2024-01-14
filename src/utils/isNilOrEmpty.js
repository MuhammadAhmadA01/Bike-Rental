import { either, isNil, isEmpty } from 'ramda'

/**
 * True if null or undefined or empty ({}, [], '', etc)
 */
const isNilOrEmpty = either(isNil, isEmpty)

export default isNilOrEmpty
