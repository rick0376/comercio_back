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
const db_1 = __importDefault(require("../db")); // Importa o Prisma Client
const router = (0, express_1.Router)();
// Recuperar todas as categorias
router.get("/categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield db_1.default.category.findMany(); // Usando o modelo do Prisma
        res.json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar categorias" });
    }
}));
// Atualizar uma categoria
router.put("/categories/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    try {
        // Atualiza a categoria com base no id
        const updatedCategory = yield db_1.default.category.update({
            where: { id }, // Prisma espera um 'string', então usamos 'id' diretamente
            data: { name }
        });
        res.json(updatedCategory);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
}));
// Excluir uma categoria
router.delete("/categories/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Exclui a categoria com base no id
        yield db_1.default.category.delete({
            where: { id } // Prisma espera um 'string', então usamos 'id' diretamente
        });
        res.status(204).send(); // Envia resposta sem conteúdo
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir categoria" });
    }
}));
exports.default = router;
