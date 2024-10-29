"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const category_1 = __importDefault(require("./routes/category")); // Importa a rota de categorias
const category_2 = __importDefault(require("./routes/category")); // Importa as rotas de categoria
const product_1 = __importDefault(require("./routes/product")); // Importa a rota de produtos
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//codigo para cloudinary
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 } // No maximo de 50 mb
}));
app.use("/api/categories", category_1.default); // Adiciona a rota de categorias
app.use("/api/products", product_1.default); // Adiciona a rota de produtos
app.use(routes_1.router);
app.use('/files', express_1.default.static(path_1.default.resolve(__dirname, '..', 'tmp')));
// Usa as rotas de categorias
app.use("/api", category_2.default);
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        //Se for uma instancia do tipo error
        return res.status(400).json({
            error: err.message
        });
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error.'
    });
});
//app.listen(3333, () => console.log('Servidor online!!!!'))
app.listen(process.env.PORT, () => console.log('Servidor online!!!!'));
