export default class ProcessVariablesValidator {
    static validate() {
        this.validateVariables([
            {
                key: 'PORT',
                value: process.env.PORT || ''
            },
            {
                key: 'DB_USER',
                value: process.env.DB_USER || ''
            },
            {
                key: 'DB_PASSWORD',
                value: process.env.DB_PASSWORD || ''
            },
            {
                key: 'DB_NAME',
                value: process.env.DB_NAME || ''
            },
            {
                key: 'DB_PORT',
                value: process.env.DB_PORT || ''
            },
            {
                key: 'DB_HOST',
                value: process.env.DB_HOST || ''
            },
            {
                key: 'CORS_ORIGIN',
                value: process.env.CORS_ORIGIN || ''
            },
            {
                key: 'CORS_METHODS',
                value: process.env.CORS_METHODS || ''
            },
            {
                key: 'ETH_NODE_API_KEY',
                value: process.env.ETH_NODE_API_KEY || ''
            },
            {
                key: 'ETH_NETWORK',
                value: process.env.ETH_NETWORK || ''
            },
        ]);
    }

    private static validateVariables(variables: { key: string; value: string }[]) {
        const errors = [];

        variables.forEach(variable => {
            if (!variable.value) {
                errors.push(`Variable ${variable.key} is not defined in .env file.`)
            }
        })

        if (errors.length > 0) {
            throw new Error(`Following errors found during env file validation: ${variables.join(',')}`);
        }
    }
}
