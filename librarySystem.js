// Function signature:
  // Store mode:
    // librarySystem(libraryName, dependencies, libraryCallback)
  // Load mode:
    // librarySystem(libraryName)

// libraryCallback parameters (only in store mode):
  // Takes each dependency in dependencies array as an argument.

// Return value (only in load mode):
  // Returns the library with required dependencies loaded.

(function () {
  // Create storage for library containers.
  var libraryStorage = {};

  function librarySystem(libraryName, dependencies, libraryCallback) {
    // If librarySystem is invoked in store mode, store the library in a container.
    if (arguments.length === 3) {
      // Create a container for the library.
      libraryStorage[libraryName] = {};
      // Store dependencies in the container for future resolution.
      libraryStorage[libraryName].dependencyStorage = dependencies;
      // Store libraryCallback in the container for future execution.
      libraryStorage[libraryName].callbackStorage = libraryCallback;
      // Create storage in the container to cache library after it is loaded the first time.
      libraryStorage[libraryName].cacheStorage = null;

    // If librarySystem is invoked in load mode, return the library with required dependencies.
    } else if (arguments.length === 1) {
      // Fetch the library from cache.
      var libraryWithRequiredDependencies = libraryStorage[libraryName].cacheStorage;

      // If the library is not in cache yet, load it and store in cache.
      if (!libraryWithRequiredDependencies) {
        // Retrieve dependencies from the library container.
        var dependencies  = libraryStorage[libraryName].dependencyStorage;
        // Retrieve libraryCallback from the library container.
        var libraryCallback = libraryStorage[libraryName].callbackStorage;

        // If the library has dependencies, load them before loading itself.
        var loadedDependencies = [];
        if (dependencies.length > 0) {
          loadedDependencies = dependencies.map(function dependencyLoader(dependencyName) {
            return librarySystem(dependencyName);
          });
        }

        // Load library with required dependencies.
        libraryWithRequiredDependencies = libraryCallback.apply(null, loadedDependencies);
        // Cache loaded library.
        libraryStorage[libraryName].cacheStorage = libraryWithRequiredDependencies;
      }

      return libraryWithRequiredDependencies;

    // If librarySystem is invoked in neither store nor load mode, throw TypeError.
    } else {
      throw new TypeError('Invalid arguments. librarySystem must be invoked in either store or load mode.');
    }
  }

  window.librarySystem = librarySystem;
})();