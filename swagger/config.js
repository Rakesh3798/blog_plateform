import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";

const options={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Blog Platform Swagger',
            version:'1.0.0',
            description: "This is a sample server blog platform Swagger. You can access the Swagger JSON at [http://localhost:5000/swagger.json](http://localhost:5000/swagger.json)",            
        },
        servers: [
            {
              url: `http://localhost:5000`
            }
        ]        
    },
     
    apis:['router/userrouter.js','router/postrouter.js','router/categoriesrouter.js','router/searchrouter.js'],
};
const specs = swaggerJSDoc(options);
const swaggerJSON = JSON.stringify(specs, null, 2);
// fs.writeFileSync('swagger.json', swaggerJSON);
// console.log('Swagger JSON saved to swagger.json');
export default specs
