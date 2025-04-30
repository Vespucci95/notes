type GraphqlTypeName<T = string> = { __typename: T }

export function isType<
  T extends Partial<GraphqlTypeName>,
  TypeName extends string
>(
  value: T | null | undefined,
  typename: TypeName
): value is T & GraphqlTypeName<TypeName> {
  return value?.__typename === typename;
}
