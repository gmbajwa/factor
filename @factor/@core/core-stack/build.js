module.exports = Factor => {
  return new (class {
    constructor() {
      const { stack } = Factor.FACTOR_CONFIG

      if (!stack) {
        return
      }

      this.stackPackage = stack
      const { factor: { id } = {} } = require(`${stack}/package.json`)
      Factor.$filters.add("packages-loader", (load, { target, extensions }) => {
        load.push({
          id: id || "servicesStack",
          name: this.stackPackage,
          mainFile: this.moduleMain(target),
          target: this.moduleTarget(target)
        })
        return load
      })
    }

    moduleTarget(target) {
      if (target.includes("cloud")) {
        return "cloud"
      } else if (target.includes("build")) {
        return "build"
      } else {
        return "app"
      }
    }

    moduleMain(target) {
      let mainFile
      const entries = ["cloud", "build"]

      entries.forEach(_ => {
        if (target.includes(_)) {
          const mainFileName = `${this.stackPackage}/${_}`
          const exists = require.resolve(mainFileName)

          mainFile = exists ? mainFileName : ""
        }
      })

      return mainFile
    }

    register() {
      // console.log("REGISTER")
    }
  })()
}
