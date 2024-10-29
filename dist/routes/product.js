"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const cloudinary_1 = __importDefault(require("../cloudinary")); // Importa a configuração do Cloudinary
const router = (0, express_1.Router)();
// Recuperar todos os produtos
router.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield db_1.default.product.findMany(); // Usando Prisma para buscar todos os produtos
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
}));
// Atualizar um produto
router.put("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, banner } = req.body;
    try {
        // Atualiza o produto com base no id
        const updatedProduct = yield db_1.default.product.update({
            where: { id }, // Prisma espera um 'string', então usamos o 'id' diretamente
            data: { name, banner }
        });
        res.json(updatedProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar produto" });
    }
}));
// Excluir um produto
router.delete("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Busca o produto pelo id para pegar a URL da imagem
        const product = yield db_1.default.product.findUnique({
            where: { id }
        });
        if (!product) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }
        // Exclui a imagem do Cloudinary
        const publicId = product.banner.split('/').pop().split('.')[0]; // Extrai o publicId da URL
        yield cloudinary_1.default.uploader.destroy(publicId);
        // Exclui o produto do banco de dados
        yield db_1.default.product.delete({
            where: { id }
        });
        res.status(204).send(); // Envia resposta sem conteúdo
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir produto" });
    }
}));
exports.default = router;
