interface validateFieldsInput {
  requested: string[]
  allowed: string[]
  option: string
}

const validateFields = ({ requested, allowed, option }: validateFieldsInput) => {
  const mapper = {
    every: () => allowed.every((field) => requested.includes(field)),
    some: () => requested.every((field) => allowed.includes(field)),
  }

  return mapper[option]()
}

export default validateFields
