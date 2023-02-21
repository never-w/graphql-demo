const _ = require("lodash")
const fs = require("fs")
const { buildSchema, isObjectType, isListType } = require("graphql")
const path = require("path")

const schemaString = fs
  .readFileSync(path.resolve(__dirname, "../schema.graphql"), {
    encoding: "utf-8",
  })
  .toString()

// 将 GraphQL schema 字符串转换为 GraphQLSchema 对象
const schema = buildSchema(schemaString)

// 定义一个将 GraphQL schema 转换为操作类型的工具函数
function getOperationsFromSchema(schema) {
  // 定义操作类型
  const operationTypes = ["query", "mutation"]

  // 定义一个空对象，用于保存操作类型及其对应的操作字段
  const operations = {}

  // 定义一个递归函数，用于将 GraphQL 类型转换为 JavaScript 对象
  const typeToObject = (type) => {
    if (isObjectType(type)) {
      const fields = type.getFields()
      return _.reduce(
        fields,
        (obj, field, fieldName) => {
          obj[fieldName] = typeToObject(field.type)
          return obj
        },
        {}
      )
    } else if (isListType(type)) {
      return [typeToObject(type.ofType)]
    } else {
      return type.toString()
    }
  }

  // 遍历操作类型
  operationTypes.forEach((operationType) => {
    // 获取操作类型的根类型
    let rootType = schema.getQueryType()
    if (operationType === "mutation") {
      rootType = schema.getMutationType()
    }

    // 如果根类型不存在，跳过该操作类型
    if (!rootType) {
      return
    }

    // 获取根类型的字段列表
    const fields = rootType.getFields()

    // 遍历字段列表
    const operationFields = {}

    _.forEach(fields, (field, name) => {
      if (field.name === "taskAcquireMaterialCommodities" || field.name === "taskInCommodities") {
        // 获取字段参数列表
        const args = field.args.reduce((argObj, arg) => {
          argObj[arg.name] = `${arg.type}`
          return argObj
        }, {})

        // 将字段信息保存到操作字段中
        operationFields[name] = {
          returnType: typeToObject(field.type),
          args,
        }
      }
    })

    // 将操作字段保存到操作类型中
    operations[operationType] = operationFields
  })

  // 返回操作类型
  return operations
}

// 调用 getOperationsFromSchema 函数并打印结果
console.dir(getOperationsFromSchema(schema), { depth: null })
