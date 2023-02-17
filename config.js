/*
 * Create and export configuration variables
 * 
 */

// Container for all the environments
var environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort': 3080,
    'envName': 'staging'
};

// Production environment
environments.production = {
    'httpPort': 5080,
    'envName': 'production'
};

// Determain which environment was passed as command-line argument
var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : 'staging';

currentEnviroment = currentEnviroment.toLowerCase();

// Check the current environment is one of the environment defined above otherwise default to staging
var environmentToExport = typeof(environments[currentEnviroment]) == 'object'? environments[currentEnviroment] : environments.staging;

// Export the module
module.exports = environmentToExport;
