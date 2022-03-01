import db from "../database/db";

import { DataTypes } from "sequelize/types";

const BlogModel =  db.define('blogs',{
    titulo_blog: {type: DataTypes.STRING},
    contenido_blog: {type: DataTypes.STRING}
})

export default BlogModel