function addDependencies(source, deps) {
  return (pkg, context) => {
    if (pkg.name === source) {
      pkg.dependencies = {
        ...pkg.dependencies,
        ...deps,
      };

      Object.entries(deps).forEach(([name, version]) => {
        context.log(`${name}@${version} added as a dependency of ${source}`);
      });
    }
  };
}

function readPackage(pkg, context) {
  [
    addDependencies("react-native", { "react-native-codegen": "0.0.7" }),
    addDependencies("@ledgerhq/live-common", { superstruct: "0.14.2" }),
  ].forEach(fn => fn(pkg, context));

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
