import snowflake from 'snowflake-sdk';
import dotenv from 'dotenv';

dotenv.config();

const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    role: process.env.SNOWFLAKE_ROLE
});

export const connectToSnowflake = () => {
    return new Promise((resolve, reject) => {
        connection.connect((err, conn) => {
            if (err) {
                console.error('❌ Unable to connect to Snowflake:', err.message);
                reject(err);
            } else {
                console.log('✅ Successfully connected to Snowflake');
                resolve(conn);
            }
        });
    });
};

export const executeQuery = (sqlText, binds = []) => {
    return new Promise((resolve, reject) => {
        connection.execute({
            sqlText,
            binds,
            complete: (err, stmt, rows) => {
                if (err) {
                    console.error('Query error:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        });
    });
};

export default connection;
