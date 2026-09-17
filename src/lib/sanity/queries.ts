export const listsQuery = `{
  "expertise": *[_type == "expertiseItem"] | order(order asc),
  "partners": *[_type == "partner" && active != false] | order(order asc),
  "memberships": *[_type == "membership" && active != false] | order(order asc)
}`
