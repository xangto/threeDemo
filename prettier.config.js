/** @type {import("prettier").Config} */
const config = {
  // 每行最大字符数
  printWidth: 100,
  // 使用单引号
  singleQuote: true,
  // 语句末尾加分号
  semi: false,
  // 尾随逗号
  trailingComma: 'all',
  // 缩进宽度
  tabWidth: 2,
  // 使用空格缩进
  useTabs: false,
  // 箭头函数参数括号：仅在需要时添加
  arrowParens: 'avoid',
  // 换行符：lf
  endOfLine: 'lf',
  // JSX 使用单引号
  jsxSingleQuote: false,
  // 对象大括号内空格
  bracketSpacing: true,
  // HTML 空白敏感度
  htmlWhitespaceSensitivity: 'css',
  // Vue 文件 script/style 缩进
  vueIndentScriptAndStyle: false,
  // 多属性元素每行单个属性
  singleAttributePerLine: true,
  // 插件
  plugins: [],
}

export default config
