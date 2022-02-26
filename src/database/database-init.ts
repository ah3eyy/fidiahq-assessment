import mongoose from "mongoose";

class DatabaseConnection {
    uri = process.env.MONGO_URI;
    connect() {
        mongoose.connect(this.uri, {})
            .then(response => {
                console.log('Database connected')
            })
            .catch(error => {
                console.log(error);
                console.log('Database connection failed')
            });
    }

}

export default new DatabaseConnection();